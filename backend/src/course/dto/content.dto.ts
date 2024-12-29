import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class CreateContentDto {
  @IsOptional()
  video?: {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
  };

  @IsOptional()
  pdf?: {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
  };

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['video', 'document', 'quiz', 'assignment'])
  type: 'video' | 'document' | 'quiz' | 'assignment';

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  transcoded?: boolean;

  @IsString()
  @IsOptional()
  originalUrl?: string;

  @IsString()
  @IsOptional()
  streamingUrl?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsNumber()
  @IsOptional()
  moduleIndex?: number;

  @IsNumber()
  @IsOptional()
  contentIndex?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString({ each: true })
  @IsOptional()
  materials?: string[];

  @IsOptional()
  metadata?: {
    lastUpdated?: Date;
    version?: number;
    downloadable?: boolean;
    estimatedDuration?: number;
  };
}

export class UpdateContentDto extends CreateContentDto {}
