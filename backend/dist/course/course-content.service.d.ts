import { Model } from 'mongoose';
import { CourseContent, CourseContentDocument } from './course-content.schema';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';
export declare class CourseContentService {
    private contentModel;
    private cloudinaryService;
    constructor(contentModel: Model<CourseContentDocument>, cloudinaryService: CloudinaryService);
    createContent(courseId: string, moduleId: string, createContentDto: CreateContentDto): Promise<CourseContent>;
    updateContent(courseId: string, moduleId: string, contentId: string, updateContentDto: UpdateContentDto): Promise<CourseContent>;
    deleteContent(courseId: string, moduleId: string, contentId: string): Promise<void>;
    getContent(courseId: string, moduleId: string): Promise<CourseContent[]>;
    getContentById(courseId: string, moduleId: string, contentId: string): Promise<CourseContent>;
}
