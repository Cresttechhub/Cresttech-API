import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  DatabaseExceptionFilter,
  ErrorMessages,
  HelperService,
  ResponseMessages,
  SIGNUP_OTP,
  SuccessResponse,
} from 'src/shared';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    private readonly helperService: HelperService,
    private eventEmitter: EventEmitter2,
  ) { }

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


  async selectCourse(id: string, courseId: number) {

    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['selectedCourses'],
      });

      if (!user) {
        return new SuccessResponse(ErrorMessages.USER_NOT_FOUND);
      }

      const alreadySelected = user.selectedCourses.some(c => c.id === courseId);

      if (alreadySelected) {
        return new SuccessResponse(ErrorMessages.COURSE_ALREADY_EXIST);
      }


      const course = await this.courseRepository.findOne({ where: { id: courseId } });

      if (!course) {
        return new SuccessResponse(ErrorMessages.COURSE_NOT_FOUND);
      }

      user.selectedCourses.push(course);
      await this.userRepository.save(user);

      return new SuccessResponse(ResponseMessages.COURSE_SELECTED, course);
    } catch (error) {
      this.logger.error(`failed to save cources`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }

  async getSelectedCourses(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['selectedCourses'],
      });

      if (!user) {
        return new SuccessResponse(ErrorMessages.USER_NOT_FOUND);
      }

      return new SuccessResponse(ResponseMessages.USER_COURSE_FETCHED, user.selectedCourses);

    } catch (error) {
      this.logger.error(`failed to get cources`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }
}
