import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  topic: string;

  @IsDateString()
  startTime: string;

  @IsNumber()
  duration: number;

  @IsString()
  @IsOptional()
  agenda?: string;
} 