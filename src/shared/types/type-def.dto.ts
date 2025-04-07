import { UserType } from './type.enum';

export class Tokens {
  /** example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y */
  accessToken: string;

  /** example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwcmluY2Vpc21haWwwOTVAZ21haWwuY29tIiwiaWF0IjoxNzEwMDg4MjczLCJleHAiOjE3MTAwODkxNzN9._VW8yfKhQWrVtD0JErygC0ly007QMiFefunupllXW9Y */
  refreshToken: string;
}

export class JwtPayload {
  id: string;
  email: string;
  userType: UserType;
}

export class PasswordRecoveryData {
  /** @example example@mail.com */
  email: string;

  /** @example 'Ismail Tijani' */
  name: string;

  resetToken: string;
}
