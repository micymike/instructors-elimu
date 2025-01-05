import { IsString, IsNumber, IsOptional, IsEnum, IsArray, Max, IsMongoId, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Video } from '../schemas/video.schema';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  cloudinaryId: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsNumber()
  @Max(1200) // 20 minutes in seconds
  duration: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional()
  @IsEnum(['private', 'public', 'unlisted'])
  @IsOptional()
  visibility?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateVideoDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsEnum(['private', 'public', 'unlisted'])
  @IsOptional()
  visibility?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  courses?: string[];
}

export class VideoResponseSwagger implements Partial<Omit<Video, '_id'>> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  cloudinaryId?: string;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsString()
  thumbnail: string;

  @ApiProperty()
  instructor: any;

  @ApiProperty()
  @IsString()
  visibility: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsNumber()
  views: number;

  @ApiProperty()
  courses: any[];

  @ApiPropertyOptional()
  @IsString()
  transcription?: string;

  @ApiPropertyOptional()
  @IsString()
  captions?: string;

  @ApiPropertyOptional()
  @IsString()
  quality?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export interface VideoResponseDto extends Video {
  id: string;
}
