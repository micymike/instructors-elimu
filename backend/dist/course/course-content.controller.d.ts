import { CourseContentService } from './course-content.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Server } from 'socket.io';
export declare class CourseContentController {
    private readonly courseContentService;
    constructor(courseContentService: CourseContentService);
    server: Server;
    createContent(courseId: string, moduleId: string, createContentDto: CreateContentDto, files: Express.Multer['File'][]): Promise<import("./course-content.schema").CourseContent>;
    updateContent(courseId: string, moduleId: string, contentId: string, updateContentDto: UpdateContentDto): Promise<import("./course-content.schema").CourseContent>;
    deleteContent(courseId: string, moduleId: string, contentId: string): Promise<{
        message: string;
    }>;
    getContent(courseId: string, moduleId: string): Promise<import("./course-content.schema").CourseContent[]>;
    getContentById(courseId: string, moduleId: string, contentId: string): Promise<import("./course-content.schema").CourseContent>;
}
