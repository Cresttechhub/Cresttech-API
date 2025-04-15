import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  Characters,
  PASSWORD_LENGTH,
  SALT_ROUNDS,
} from './constants/constants';

@Injectable()
export class HelperService {
  private readonly OTP_EXPIRY_MINUTES = 10;

  async hash(data: string) {
    return bcrypt.hash(data, SALT_ROUNDS);
  }

  async compareHash(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }

  generatePassword() {
    return Array.from({ length: PASSWORD_LENGTH }, () =>
      Characters.charAt(Math.floor(Math.random() * Characters.length)),
    ).join('');
  }

  generateOTP() {
    try {
      const bytes = crypto.randomBytes(3);
      return ((bytes.readUIntBE(0, 3) % 900000) + 100000).toString();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error Generating OTP');
    }
  }

  calculateOtpExpiry(): Date {
    return new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
  }

  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generatePaginationResponse(
    limit: number = 10,
    offset: number = 0,
    totalCount: number,
    data: any[],
  ) {
    const totalPages = Math.ceil(totalCount / limit);

    return {
      numberOfElements: data.length,
      totalElements: totalCount,
      first: offset === 0,
      last: data.length + offset === totalCount,
      totalPages,
      data,
    };
  }
}
