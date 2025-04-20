import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { DatabaseExceptionFilter, ErrorMessages, ResponseMessages, SuccessResponse } from 'src/shared';

@Injectable()
export class CourseService {

  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>
  ) { }

  async create(courseData: CreateCourseDto) {
    const { name } = courseData;
    try {
      const existingCourse = await this.courseRepository.existsBy({ name });

      if (existingCourse) {
        return new SuccessResponse(ErrorMessages.COURSE_ALREADY_EXIST, null, 409);
      }

      const newCourse = await this.courseRepository.create({
        ...courseData
      })

      await this.courseRepository.save(newCourse);
      return new SuccessResponse(ResponseMessages.CREATE_COURSE);
    } catch (error) {
      this.logger.error(`Course creation failed for ${name}`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }

  async findAll() {
    try {
      const cources = await this.courseRepository.find();
      return new SuccessResponse(ResponseMessages.FIND_COURSES, cources);
    } catch (error) {
      this.logger.error(`failed to fetch cources`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      return new SuccessResponse(ErrorMessages.COURSE_NOT_FOUND, null, 400);
    }
    return new SuccessResponse(ResponseMessages.FIND_COURSE, course);
  }

  async update(id: number, courseData: UpdateCourseDto) {
    const { name } = courseData;

    try {
      const existingCourse = await this.courseRepository.existsBy({ name });

      if (existingCourse) {
        return new SuccessResponse(ErrorMessages.COURSE_ALREADY_EXIST, null, 409);
      }

      await this.courseRepository.update({ id }, { ...courseData });
      return new SuccessResponse(ResponseMessages.UPDATE_COURSE);
    } catch (error) {
      this.logger.error(`Course update failed for ${name}`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }

  async remove(id: number) {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });

      if (!course) {
        return new SuccessResponse(ErrorMessages.COURSE_NOT_FOUND, null, 400);
      }

      await this.courseRepository.remove(course);

      return new SuccessResponse(ResponseMessages.COURSE_DELETED, course);
    } catch (error) {
      this.logger.error(`Failed to remove course`, error.stack);
      throw new DatabaseExceptionFilter(error);
    }
  }
}
