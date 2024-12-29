import { IsString, IsEmail, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  phone?: string;

  @IsString()
  occupation?: string;

  @IsString()
  profession?: string;

  @IsString()
  specialty?: string;

  @IsNumber()
  yearsOfExperience?: number;

  @IsArray()
  teachingAreas?: string[];

  @IsString()
  details?: string;

  @IsString()
  cv?: string;

  @IsOptional()
  @IsArray()
  certifications?: string[];

  @IsOptional()
  @IsArray()
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}
