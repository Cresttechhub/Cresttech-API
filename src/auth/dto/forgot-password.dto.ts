import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  /**
   * This should be the same email used to sign up
   * @example example@gmail.com
   */
  @IsEmail()
  email: string;
}
