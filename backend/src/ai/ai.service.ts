import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../services/gemini.service';
import Groq from 'groq-sdk';

@Injectable()
export class AIService {
    private groq: Groq;

    constructor(
        private configService: ConfigService,
        private geminiService: GeminiService
    ) {
        this.groq = new Groq({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }

    async generateStructuredResponse(prompt: string): Promise<any> {
        try {
            const result = await this.geminiService.generateResponse(prompt, 'course-generation');
            return result;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate response');
        }
    }

    async generateMultimodalResponse(prompt: string, context?: any) {
        // Provide a default stage if not specified
        const geminiResponse = await this.geminiService.generateResponse(prompt, 'multimodal');
        return geminiResponse;
    }
}