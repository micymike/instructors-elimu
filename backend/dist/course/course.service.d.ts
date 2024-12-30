import { Model } from 'mongoose';
import { CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { GeminiService } from '../ai/gemini.service';
export declare class CourseService {
    private courseModel;
    private geminiService;
    constructor(courseModel: Model<CourseDocument>, geminiService: GeminiService);
    create(createCourseDto: CreateCourseDto): Promise<CourseDocument>;
    findAll(): Promise<CourseDocument[]>;
    findOne(id: string): Promise<CourseDocument>;
    generateLearningObjectives(subject: string, level: string): Promise<string>;
    generateCourseSchedule(subject: string, level: string): Promise<string>;
    generateAssessments(subject: string, level: string): Promise<string>;
}
