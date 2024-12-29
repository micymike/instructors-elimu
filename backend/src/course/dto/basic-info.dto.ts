import { IsString, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CurriculumDto {
  @IsString()
  @IsNotEmpty()
  system: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  subjectLevel: string;

  @IsString()
  examBoard: string;
}

export class BasicInfoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CurriculumDto)
  curriculum: CurriculumDto;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  duration: string;

  @IsString()
  prerequisites: string;

  @IsString()
  objectives: string;
}
