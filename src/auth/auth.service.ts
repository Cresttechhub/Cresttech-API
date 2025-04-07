import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  DatabaseExceptionFilter,
  EMAIL_VERIFIED,
  HelperService,
} from 'src/shared';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtHandler } from 'src/shared/jwt-service';
import { plainToInstance } from 'class-transformer';
import { UserResDto } from 'src/user/dto/user-res.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtHandler,
    private eventEmitter: EventEmitter2,
  ) {}

  async verifyUserOtp(dto: VerifyOtpDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'otp', 'fullName', 'otpExpiresAt', 'isVerified'],
    });

    if (!user)
      throw new NotFoundException(
        'Invalid credentials. Please check your details and try again.',
      );

    this.validateOtp(user, dto.otp);

    await this.markUserAsVerified(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'fullName', 'password', 'isVerified', 'userType'],
    });

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Account not active.Please verify your email.',
      );
    }

    const isPasswordValid = await this.helperService.compareHash(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.jwtService.generateTokens({
      id: user.id,
      email: user.email,
      userType: user.userType,
    });

    return plainToInstance(
      UserResDto,
      {
        ...user,
        ...tokens,
      },
      { excludeExtraneousValues: true },
    );
  }

  private validateOtp(user: User, otp: string): void {
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    const isOtpValid = user.otp === otp;
    const isOtpExpired = !user.otpExpiresAt || user.otpExpiresAt < new Date();
    // const isOtpExpired = user.otpExpiresAt < new Date();

    if (!isOtpValid || isOtpExpired) {
      throw new BadRequestException('Invalid or expired OTP');
    }
  }

  private async markUserAsVerified(user: User): Promise<void> {
    try {
      user.isVerified = true;
      user.otp = null;
      user.otpExpiresAt = null;

      const updatedUser = await this.userRepository.save(user);
      this.eventEmitter.emit(EMAIL_VERIFIED, {
        name: updatedUser.fullName,
        email: user.email,
      });
    } catch (error) {
      this.logger.error(`Failed to verify user ${user.email}`, error.stack);
      throw new DatabaseExceptionFilter('Failed to complete verification');
    }
  }
}
