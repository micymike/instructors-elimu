import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  IsEnum, 
  ValidateNested, 
  IsNumber 
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export class InstructorDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => InstructorDto)
  instructor: InstructorDto;

  @IsString()
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @IsOptional()
  @IsArray()
  resources?: string[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  status?: string;

  // These will be added by the backend
  createdAt?: Date;
  updatedAt?: Date;
}
