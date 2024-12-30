import { CourseGenerationService } from './course-generation.service';
export declare class CourseGenerationController {
    private readonly courseGenerationService;
    constructor(courseGenerationService: CourseGenerationService);
    generateCourse(body: {
        mode: string;
        subject: string;
        level: string;
    }): Promise<any>;
    enhanceCourse(body: {
        content: string;
    }): Promise<any>;
}
