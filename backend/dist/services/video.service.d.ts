import { Model } from 'mongoose';
import { VideoDocument, VideoResponse } from '../schemas/video.schema';
import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto';
import { ConfigService } from '@nestjs/config';
export declare class VideoService {
    private videoModel;
    private configService;
    constructor(videoModel: Model<VideoDocument>, configService: ConfigService);
    create(createVideoDto: CreateVideoDto, instructorId: string): Promise<VideoResponse>;
    findAll(instructorId: string, query: {
        visibility?: string;
        tags?: string[];
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<{
        videos: VideoResponse[];
        total: number;
    }>;
    findOne(id: string, instructorId: string): Promise<VideoResponse>;
    update(id: string, updateVideoDto: UpdateVideoDto, instructorId: string): Promise<VideoResponse>;
    remove(id: string, instructorId: string): Promise<void>;
    getCloudinarySignature(): Promise<{
        signature: string;
        timestamp: number;
        cloudName: string;
        apiKey: string;
    }>;
    incrementViews(id: string): Promise<void>;
    addToCourse(videoId: string, courseId: string, instructorId: string): Promise<VideoResponse>;
    removeFromCourse(videoId: string, courseId: string, instructorId: string): Promise<VideoResponse>;
    validateVideo(file: Express.Multer.File): Promise<void>;
}
