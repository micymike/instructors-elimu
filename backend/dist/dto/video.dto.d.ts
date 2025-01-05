import { Video } from '../schemas/video.schema';
export declare class CreateVideoDto {
    title: string;
    description?: string;
    cloudinaryId: string;
    url: string;
    duration: number;
    thumbnail?: string;
    visibility?: string;
    tags?: string[];
}
export declare class UpdateVideoDto {
    title?: string;
    description?: string;
    visibility?: string;
    tags?: string[];
    courses?: string[];
}
export declare class VideoResponseSwagger implements Partial<Omit<Video, '_id'>> {
    id: string;
    title: string;
    description: string;
    url: string;
    cloudinaryId?: string;
    duration: number;
    thumbnail: string;
    instructor: any;
    visibility: string;
    tags: string[];
    views: number;
    courses: any[];
    transcription?: string;
    captions?: string;
    quality?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface VideoResponseDto extends Video {
    id: string;
}
