import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ResponseMessages, SuccessResponse } from 'src/shared';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from 'src/auth/dto/login.res.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordResetService } from 'src/password-reset/password-reset.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private passwordResetService: PasswordResetService,
  ) {}

  /**
   * Creates new user account with verification OTP.
   *
   * @param {CreateUserDto} userData - New user registration data
   * @throws {ConflictException} If email already registered
   * @throws {DatabaseExceptionFilter} If user creation fails
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: CreateUserDto) {
    await this.userService.createUser(userData);
    return new SuccessResponse(ResponseMessages.CREATE_USER);
  }

  /**
   * Verifies user OTP and marks account as verified.
   *
   * @param {VerifyOtpDto} dto - Contains email and OTP for verification
   * @throws {NotFoundException} When no user exists with provided email
   * @throws {BadRequestException} When OTP is invalid/expired or user already verified
   * @throws {DatabaseExceptionFilter} If verification fails to persist
   */
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyUserOtp(dto);
    return new SuccessResponse(ResponseMessages.UPDATE_USER);
  }

  /**
   * Authenticates user and generates JWT tokens.
   *
   * @param {LoginDto} dto - User credentials (email and password)
   * @throws {NotFoundException} When no user exists with provided email
   * @throws {UnauthorizedException} For invalid password or unverified account
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  // @Serialize(UserResDto)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto);
    return new LoginResponseDto(ResponseMessages.LOGIN_SUCCESS, user);
  }

  @Get('validate-reset-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Query('token') token: string) {
    await this.passwordResetService.validateResetToken(token);
    return new SuccessResponse('', true);
    // return { valid: true };
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() data: ResetPasswordDto) {
    await this.authService.resetPassword(data);
    return new SuccessResponse(ResponseMessages.PASSWORD_RESET_SUCCESS);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    await this.authService.forgotPassowrd(data);
    return new SuccessResponse(ResponseMessages.FORGOT_PASSWORD);
  }
}
