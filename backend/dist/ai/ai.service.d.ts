import { GeminiService } from './gemini.service';
export declare class AIService {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    generateStructuredResponse(prompt: string): Promise<any>;
}
