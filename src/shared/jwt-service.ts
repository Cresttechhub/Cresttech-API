import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload, Tokens } from './types/type-def.dto';
import { ErrorMessages } from './messages/error-messages.enum';

@Injectable()
export class JwtHandler {
  private readonly logger: Logger;
  private readonly SECRET: string;
  private readonly TOKEN_EXPIRATION: number;
  private readonly RT_SECRET: string;
  private readonly RT_EXPIRATION: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(JwtHandler.name);
    this.SECRET = this.config.getOrThrow<string>('JWT_SECRET');
    this.RT_SECRET = this.config.getOrThrow<string>('JWT_SECRET');
    this.TOKEN_EXPIRATION = Number(this.config.get<string>('JWT_AT_TTL'));
    this.RT_EXPIRATION = Number(this.config.get<string>('JWT_RT_TTL'));
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [scheme, token] = authHeader.split(' ');
    if (!token || !/^Bearer$/i.test(scheme)) return undefined;

    return token;
  }

  async generateTokens(payload: JwtPayload): Promise<Tokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.SECRET,
          expiresIn: this.TOKEN_EXPIRATION,
        }),
        this.jwtService.signAsync(payload, {
          secret: this.RT_SECRET,
          expiresIn: this.RT_EXPIRATION,
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Error generating tokens:', error);
      throw new InternalServerErrorException();
    }
  }

  async validateToken(request: Request) {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ErrorMessages.INVALID_AUTH_TOKEN_ERROR);
    }

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.SECRET,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Token validation failed: ${error.message}`);
        throw new UnauthorizedException(
          error.message || ErrorMessages.INVALID_AUTH_TOKEN_ERROR,
        );
      }
    }
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.SECRET,
      });
    } catch (error) {
      this.logger.error('Error verifying token:', error);
      throw new BadRequestException('Invalid or Expired Token');
    }
  }

  async generateResetToken(email: string) {
    try {
      return await this.jwtService.signAsync(
        { email },
        {
          secret: this.SECRET,
          expiresIn: this.TOKEN_EXPIRATION,
        },
      );
    } catch (error) {
      this.logger.error('Error generating reset token:', error);
      throw new InternalServerErrorException('Failed to generate reset token');
    }
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.RT_SECRET,
        },
      );

      return await this.generateTokens({
        id: payload.id,
        email: payload.email,
        userType: payload.userType,
      });
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw new UnauthorizedException(ErrorMessages.INVALID_AUTH_TOKEN_ERROR);
    }
  }
}
