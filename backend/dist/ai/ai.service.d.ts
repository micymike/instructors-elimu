import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../services/gemini.service';
export declare class AIService {
    private configService;
    private geminiService;
    private groq;
    constructor(configService: ConfigService, geminiService: GeminiService);
    generateStructuredResponse(prompt: string): Promise<any>;
    generateMultimodalResponse(prompt: string, context?: any): Promise<string>;
}
