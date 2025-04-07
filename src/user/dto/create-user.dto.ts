import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  /** @example "Ismail Tijani" */
  @IsNotEmpty()
  @IsString()
  fullName: string;

  /** @example example@gmail.com */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /** @example 0808*******9 */
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  phoneNumber: string;

  /** @example PasswordExampl@20 */
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    },
  )
  password: string;
}
