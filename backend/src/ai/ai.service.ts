import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Injectable()
export class AIService {
    constructor(private readonly geminiService: GeminiService) { }

    async generateStructuredResponse(prompt: string): Promise<any> {
        try {
            const result = await this.geminiService.generateResponse(prompt, 'course-generation');
            return result;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate response');
        }
    }
} 