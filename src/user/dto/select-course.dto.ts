import { IsNotEmpty, IsNumber } from "class-validator";

// select-course.dto.ts
export class SelectCourseDto {
    @IsNotEmpty()
    @IsNumber()
    courseId: number;
}
