import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperService } from 'src/shared';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Course])],
  controllers: [UserController],
  providers: [UserService, HelperService],
})
export class UserModule { }
