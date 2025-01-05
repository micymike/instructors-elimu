import { GeminiService } from '../services/gemini.service';
export interface CourseWizardFormattedResponse {
    sections: {
        title: string;
        content: string[];
    }[];
}
export declare class CourseWizardService {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    private formatAIResponse;
    analyzeCourse(basicInfo: any): Promise<CourseWizardFormattedResponse>;
    generateSyllabus(data: any): Promise<CourseWizardFormattedResponse>;
}
