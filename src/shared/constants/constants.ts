import { SetMetadata } from '@nestjs/common';

export const Characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const PASSWORD_LENGTH = 8;
export const SALT_ROUNDS = 6;
export const PASSWORD_RESET_PREFIX = 'password-reset:otp';

export const DEFAULT_ADMIN_ROLE_NAME = 'DEFAULT ADMIN ROLE';
export const SUPER_ADMIN_ROLE_NAME = 'SBOARD SUPER ADMIN ROLE';
export const STUDENT_ROLE_NAME = 'STUDENT ROLE';
export const SIGNUP_OTP = 'auth.signup_otp';
export const EMAIL_VERIFIED = 'auth.email_verified';
export const PASSWORD_RESET = 'auth.password_reset';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
