import { VideoService } from '../services/video.service';
import { CreateVideoDto, UpdateVideoDto, VideoResponseSwagger } from '../dto/video.dto';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    create(createVideoDto: CreateVideoDto, instructorId: string): Promise<VideoResponseSwagger>;
    findAll(instructorId: string, visibility?: string, tags?: string[], search?: string, page?: number, limit?: number, sort?: string): Promise<{
        videos: VideoResponseSwagger[];
        total: number;
    }>;
    findOne(id: string, instructorId: string): Promise<VideoResponseSwagger>;
    update(id: string, updateVideoDto: UpdateVideoDto, instructorId: string): Promise<VideoResponseSwagger>;
    remove(id: string, instructorId: string): Promise<void>;
    getSignature(): Promise<{
        signature: string;
        timestamp: number;
        cloudName: string;
        apiKey: string;
    }>;
    incrementViews(id: string): Promise<void>;
    addToCourse(videoId: string, courseId: string, instructorId: string): Promise<VideoResponseSwagger>;
    removeFromCourse(videoId: string, courseId: string, instructorId: string): Promise<VideoResponseSwagger>;
    validateVideo(file: Express.Multer.File): Promise<void>;
}
