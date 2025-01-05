import { GeminiService } from '../services/gemini.service';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Request as ExpressRequest } from 'express';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';
export declare class CourseController {
    private readonly courseService;
    private readonly notificationService;
    private readonly geminiService;
    private readonly cloudinaryService;
    constructor(courseService: CourseService, notificationService: NotificationService, geminiService: GeminiService, cloudinaryService: CloudinaryService);
    private authenticateRequest;
    learn(id: string, req: ExpressRequest): Promise<{
        message: string;
    }>;
    createCourse(req: ExpressRequest, courseData: CreateCourseDto): Promise<any>;
    private generateCourseInsights;
    private generateLearningPath;
    getAllCourses(req: ExpressRequest): Promise<any>;
    getAllCoursesWithUser(req: ExpressRequest): Promise<{
        message: string;
        data: import("../schemas/course.schema").Course[];
    }>;
    generateCourse(createCourseDto: CreateCourseDto, req: ExpressRequest): Promise<any>;
    findOne(id: string, req: ExpressRequest): Promise<{
        statusCode: number;
        message: string;
        data: import("../schemas/course.schema").Course;
    }>;
    getCourseStats(req: ExpressRequest): Promise<{
        message: string;
        data: {
            totalCourses: number;
            activeCourses: number;
            totalStudents: any;
            teachingHours: any;
        };
    }>;
    update(req: ExpressRequest, id: string, updateCourseDto: UpdateCourseDto): Promise<{
        message: string;
        data: import("../schemas/course.schema").Course;
    }>;
    updateContent(id: string, updateContentDto: any, req: ExpressRequest): Promise<{
        message: string;
        data: import("../schemas/course.schema").Course;
    }>;
    remove(id: string, req: ExpressRequest): Promise<{
        message: string;
        data: any;
    }>;
    getContent(id: string, req: ExpressRequest): Promise<{
        message: string;
        data: {
            title: string;
            description: string;
            content: Array<{
                type: string;
                title: string;
                description: string;
                url?: string;
                duration?: number;
            }>;
        }[];
    }>;
    uploadContent(id: string, file: Express.Multer.File, req: ExpressRequest): Promise<{
        message: string;
        data: import("../schemas/course.schema").Course;
    }>;
    generateContent(body: {
        message: string;
    }, req: ExpressRequest): Promise<{
        message: string;
        data: string;
    }>;
    getCourseMaterials(courseId: string, req: ExpressRequest): Promise<{
        message: string;
        data: any[];
    }>;
    addCourseMaterial(courseId: string, file: Express.Multer.File, req: ExpressRequest): Promise<{
        message: string;
        data: {
            url: string;
            name: string;
            type: "pdf" | "video" | "document";
            uploadedAt: Date;
        }[];
    }>;
    private getFileType;
}
