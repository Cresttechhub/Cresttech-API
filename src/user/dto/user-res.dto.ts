import { Expose } from 'class-transformer';

export class UserResDto {
  /** @example 007 */
  @Expose()
  id: string;

  /** @example "Ismail Tijani" */
  @Expose()
  fullName: string;

  /** @example example@gmail.com */
  @Expose()
  email: string;

  /** @example false */
  @Expose()
  isVerified: boolean;

  /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.edCI6MTc0NoxNzQ0MDE1MzQzfQ.KSmE-_c1z9pNA */
  @Expose()
  accessToken: string;

  /** @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.edCI6MTc0NoxNzQ0MDE1MzQzfQ.KSmE-_c1z9pNA */
  @Expose()
  refreshToken: string;
}
