import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  DatabaseExceptionFilter,
  EMAIL_VERIFIED,
  ErrorMessages,
  HelperService,
  PASSWORD_RESET,
  ResponseMessages,
} from 'src/shared';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtHandler } from 'src/shared/jwt-service';
import { plainToInstance } from 'class-transformer';
import { UserResDto } from 'src/user/dto/user-res.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetService } from 'src/password-reset/password-reset.service';
import { PasswordReset } from 'src/password-reset/entities/password-reset.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtHandler,
    private passwordResetService: PasswordResetService,
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
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.helperService.compareHash(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Account not active.Please verify your email.',
      );
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

  forgotPassowrd = async (data: ForgotPasswordDto): Promise<void | string> => {
    const { email } = data;
    const user = await this.userRepository.findOneBy({ email });
    // Return success to prevent email enumeration
    if (!user) {
      return ResponseMessages.FORGOT_PASSWORD;
    }
    try {
      const resetToken = await this.passwordResetService.createResetToken(user);
      this.eventEmitter.emit(PASSWORD_RESET, {
        email,
        resetToken,
        name: user.fullName,
      });
    } catch (error) {
      this.logger.error(
        `Password recovery failed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        ErrorMessages.PASSWORD_RESET_FAILED,
      );
    }
  };

  async resetPassword(resetData: ResetPasswordDto) {
    const { resetToken, newPassword, confirmPassword } = resetData;
    if (newPassword !== confirmPassword)
      throw new BadRequestException(ErrorMessages.PASSWORD_MISMATCH);

    const { user, tokenHash } =
      await this.passwordResetService.validateResetToken(resetToken);
    try {
      await this.entityManager.transaction(async (em) => {
        // Update password
        await em.update(
          User,
          { id: user.id },
          { password: await this.helperService.hash(newPassword) },
        );
        // Invalidate token
        await em.update(PasswordReset, { token: tokenHash }, { used: true });
      });
      // await this.mailService.sendPasswordChangedNotification(user.email);
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`, error.stack);
      throw new BadRequestException(ErrorMessages.PASSWORD_RESET_FAILED);
    }
  }
  // Helper Methods
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
