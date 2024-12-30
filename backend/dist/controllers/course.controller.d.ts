import { GeminiService } from 'src/ai/gemini.service';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        role: string;
    };
}
export declare class CourseController {
    private readonly courseService;
    private readonly notificationService;
    private readonly geminiService;
    constructor(courseService: CourseService, notificationService: NotificationService, geminiService: GeminiService);
    learn(id: string): Promise<string>;
    create(createCourseDto: CreateCourseDto): Promise<any>;
    generateCourse(createCourseDto: CreateCourseDto): Promise<any>;
    analyze(createCourseDto: CreateCourseDto): Promise<any>;
    findAll(req: any): Promise<import("../schemas/course.schema").Course[]>;
    findOne(id: string): Promise<import("../schemas/course.schema").Course>;
    update(req: RequestWithUser, id: string, updateCourseDto: UpdateCourseDto): Promise<import("../schemas/course.schema").Course>;
    updateContent(id: string, updateContentDto: any): Promise<any>;
    remove(id: string): Promise<any>;
    getContent(id: string): Promise<import("../schemas/course.schema").Course>;
    uploadContent(id: string, file: Express.Multer.File): Promise<import("../schemas/course.schema").Course>;
}
export {};
