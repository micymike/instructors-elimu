import { AIService } from '../../ai/ai.service';
export declare class CourseGenerationService {
    private aiService;
    constructor(aiService: AIService);
    generateCourse(subject: string, level: string): Promise<any>;
    generateLearningObjectives(subject: string, level: string): Promise<any>;
    generateCourseSchedule(subject: string, level: string): Promise<any>;
    generateAssessments(subject: string, level: string): Promise<any>;
    enhanceCourseContent(content: string): Promise<any>;
}
