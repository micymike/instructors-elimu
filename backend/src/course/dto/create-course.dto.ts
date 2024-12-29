import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseData: string;

  @IsString()
  @IsOptional()
  instructor?: string;
}