import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @IsOptional()
  @IsArray()
  resources?: string[];

  // These will be added by the backend
  instructor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
