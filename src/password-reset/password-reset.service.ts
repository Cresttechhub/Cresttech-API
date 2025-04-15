import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PasswordReset } from './entities/password-reset.entity';
import { User } from 'src/user/entities/user.entity';
import { ErrorMessages, HelperService } from 'src/shared';
import { JwtHandler } from 'src/shared/jwt-service';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  constructor(
    @InjectRepository(PasswordReset)
    private readonly tokenRepository: Repository<PasswordReset>,
    private readonly configService: ConfigService,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtHandler,
  ) {}

  async createResetToken(user: User): Promise<string> {
    await this.tokenRepository.update(
      { user: { id: user.id }, used: false },
      { used: true },
    );

    const resetToken = this.helperService.generateToken();
    const tokenHash = this.helperService.hashToken(resetToken);
    const jwtToken = await this.jwtService.generateResetToken({
      sub: user.id,
      token: tokenHash,
    });
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await this.tokenRepository.save({
      token: tokenHash,
      expiresAt,
      user,
    });

    return jwtToken;
  }

  async validateResetToken(
    token: string,
  ): Promise<{ user: User; tokenHash: string }> {
    const payload = await this.jwtService.verifyToken(token);

    const resetToken = await this.tokenRepository.findOne({
      where: {
        token: payload.token,
        used: false,
        userId: payload.sub,
      },
      relations: ['user'],
    });

    if (!resetToken || resetToken.isExpired()) {
      throw new BadRequestException(ErrorMessages.RESET_TOKEN_ERROR);
    }

    return { user: resetToken.user, tokenHash: payload.token };
  }

  async markTokenAsUsed(tokenHash: string): Promise<void> {
    await this.tokenRepository.update({ token: tokenHash }, { used: true });
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
