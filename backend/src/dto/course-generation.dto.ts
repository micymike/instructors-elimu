import { IsString, IsNotEmpty } from 'class-validator';

export class CourseGenerationDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  educationLevel: string;

  @IsString()
  @IsNotEmpty()
  term: string;
} 