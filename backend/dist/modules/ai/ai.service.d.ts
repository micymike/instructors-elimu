import { ConfigService } from '@nestjs/config';
export declare class AIService {
    private configService;
    private groq;
    constructor(configService: ConfigService);
    generateStructuredResponse(prompt: string): Promise<any>;
    generateQuestions(subject: string, topic: string, difficulty: string, count?: number): Promise<any>;
    suggestImprovements(questions: any[]): Promise<string>;
}
