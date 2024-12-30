import { Model } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
export declare class CourseService {
    private courseModel;
    constructor(courseModel: Model<Course>);
    create(createCourseDto: CreateCourseDto, userId: string): Promise<Course>;
    findAll(userId?: string): Promise<Course[]>;
    findOne(id: string): Promise<Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
    remove(id: string): Promise<any>;
    addContent(courseId: string, content: any): Promise<Course>;
    removeContent(courseId: string, contentIndex: number): Promise<Course>;
    updateContent(courseId: string, updateContentDto: any): Promise<Course>;
}
