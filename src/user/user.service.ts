import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  DatabaseExceptionFilter,
  ErrorMessages,
  HelperService,
  SIGNUP_OTP,
} from 'src/shared';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly helperService: HelperService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(userData: CreateUserDto) {
    const { email, password, fullName } = userData;

    const existingUser = await this.userRepository.existsBy({ email });
    if (existingUser) {
      throw new ConflictException(ErrorMessages.USER_EMAIL_EXISTS_ERROR);
    }

    const hashedPassword = await this.helperService.hash(password);
    const otp = this.helperService.generateOTP();
    console.log(otp);
    const otpExpiresAt = this.helperService.calculateOtpExpiry();
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });
    try {
      await this.userRepository.save(newUser);
      this.eventEmitter.emit(SIGNUP_OTP, { email, fullName, otp });
    } catch (error) {
      this.logger.error(`User creation failed for ${email}`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }
}
