import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;
}
