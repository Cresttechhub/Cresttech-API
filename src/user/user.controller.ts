import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SelectCourseDto } from './dto/select-course.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id/courses')
  async getSelectedCourses(@Param('id') id: string) {
    const courses = await this.userService.getSelectedCourses(id);
    return { courses };
  }

  @Post(':id/select-course')
  async selectCourse(
    @Param('id') userId: string,
    @Body() dto: SelectCourseDto,
  ) {
    return await this.userService.selectCourse(userId, dto.courseId);
  }
}
