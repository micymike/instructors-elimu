import { GeminiService } from '../services/gemini.service';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Request as ExpressRequest } from 'express';
import { Course as CourseSchema } from '../schemas/course.schema';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';
export declare class CourseController {
    private readonly courseService;
    private readonly notificationService;
    private readonly geminiService;
    private readonly cloudinaryService;
    logger: any;
    constructor(courseService: CourseService, notificationService: NotificationService, geminiService: GeminiService, cloudinaryService: CloudinaryService);
    private authenticateRequest;
    learn(id: string, req: ExpressRequest): Promise<{
        message: string;
    }>;
    createCourse(req: ExpressRequest, courseData: CreateCourseDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            course: CourseSchema & {
                id: string;
            };
            insights: any;
        };
    }>;
    private generateCourseInsights;
    private generateLearningPath;
    getAllCourses(req: ExpressRequest): Promise<any>;
    getAllCoursesWithUser(req: ExpressRequest): Promise<{
        message: string;
        data: CourseSchema[];
    }>;
    generateCourse(createCourseDto: CreateCourseDto, req: ExpressRequest): Promise<any>;
    getCourseById(req: ExpressRequest, courseId: string): Promise<CourseSchema>;
    updateCourseContent(req: ExpressRequest, courseId: string, contentData: any): Promise<CourseSchema>;
    getCourseStats(req: ExpressRequest): Promise<{
        message: string;
        data: {
            totalCourses: number;
            activeCourses: number;
            totalStudents: any;
            teachingHours: number;
        };
    }>;
    getInstructorStats(req: ExpressRequest): Promise<{
        statusCode: number;
        message: string;
        data: {
            totalCourses: number;
            activeCourses: number;
            totalStudents: number;
            teachingHours: number;
            recentActivity: any[];
            upcomingSchedule: any[];
        };
    }>;
    updateCourse(req: ExpressRequest, courseId: string, updateData: UpdateCourseDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            course: CourseSchema & {
                id: string;
            };
            improvementSuggestions: any;
        };
    }>;
    private generateCourseImprovementSuggestions;
    private extractPotentialEnhancements;
    updateContent(id: string, updateContentDto: any, req: ExpressRequest): Promise<{
        message: string;
        data: CourseSchema;
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
                scheduledTime?: Date;
                meetingLink?: string;
                maxDuration?: number;
                resourceType?: string;
                isRequired?: boolean;
                dueDate?: Date;
            }>;
        }[];
    }>;
    uploadContent(id: string, file: Express.Multer.File, req: ExpressRequest): Promise<{
        message: string;
        data: CourseSchema;
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
            isDownloadable: boolean;
        };
    }>;
    private getFileType;
}
