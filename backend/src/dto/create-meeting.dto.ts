import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsNumber()
  duration: number;

  @IsString()
  description: string;

  @IsBoolean()
  recurring: boolean;

  @IsNumber()
  maxParticipants: number;

  @IsBoolean()
  requiresRegistration: boolean;

  @IsOptional()
  materials: any[];
}
