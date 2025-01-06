import { Model } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';
export declare class CourseService {
    private courseModel;
    private cloudinaryService;
    private readonly logger;
    constructor(courseModel: Model<Course>, cloudinaryService: CloudinaryService);
    createCourse(createCourseDto: CreateCourseDto, user: {
        id?: string;
        email?: string;
        role?: string;
    }): Promise<Course>;
    findAll(userId?: string): Promise<Course[]>;
    findAllByEmail(email: string): Promise<Course[]>;
    getAllCourses(user: {
        id?: string;
        email?: string;
        role?: string;
    }): Promise<Course[]>;
    findOne(id: string, instructorEmail?: string): Promise<Course>;
    getCourseStats(instructorEmail: string): Promise<{
        totalCourses: number;
        activeCourses: number;
        totalStudents: any;
        teachingHours: any;
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
    remove(id: string): Promise<any>;
    addContent(courseId: string, content: any): Promise<Course>;
    removeContent(courseId: string, contentIndex: number): Promise<Course>;
    updateContent(courseId: string, updateContentDto: any): Promise<Course>;
    getCourseMaterials(courseId: string): Promise<any[]>;
    addMaterial(courseId: string, material: {
        url: string;
        name: string;
        type: 'pdf' | 'video' | 'document';
        uploadedAt: Date;
        isDownloadable: boolean;
        duration?: number;
        size?: number;
    }): Promise<Course>;
    addCourseMaterial(courseId: string, material: {
        url: string;
        name: string;
        type: 'pdf' | 'video' | 'document';
        uploadedAt: Date;
    }): Promise<Course>;
}
