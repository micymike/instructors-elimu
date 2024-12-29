import { IsString, IsEnum, IsArray, IsNumber, IsOptional, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { BasicInfoDto } from './basic-info.dto';

export class SyllabusItemDto {
  @IsNumber()
  week: number;

  @IsString()
  topic: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  activities: string[];
}

export class ScheduleSessionDto {
  @IsString()
  sessionTitle: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  duration: number;

  @IsEnum(['live', 'recorded'])
  type: string;

  @IsString()
  @IsOptional()
  zoomLink?: string;
}

export class ResourceDto {
  @IsString()
  title: string;

  @IsEnum(['document', 'video', 'link', 'other'])
  type: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssessmentDto {
  @IsString()
  title: string;

  @IsEnum(['quiz', 'assignment', 'project', 'exam'])
  type: string;

  @IsNumber()
  totalPoints: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @IsString()
  instructions: string;
}

export class CourseWizardDto {
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo: BasicInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyllabusItemDto)
  syllabus: SyllabusItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSessionDto)
  schedule: ScheduleSessionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  resources: ResourceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentDto)
  assessments: AssessmentDto[];
}
