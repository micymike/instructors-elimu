import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AIService {
    private groq: Groq;

    constructor(private configService: ConfigService) {
        this.groq = new Groq({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }

    async generateStructuredResponse(prompt: string) {
        const completion = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert education content creator and course designer."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 4000,
        });

        try {
            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error parsing Groq response:', error);
            return completion.choices[0].message.content;
        }
    }

    async generateQuestions(subject: string, topic: string, difficulty: string, count: number = 5) {
        const prompt = `Generate ${count} multiple-choice questions about ${subject}, specifically on the topic of ${topic}. 
        The difficulty level should be ${difficulty}. 
        For each question, provide:
        1. The question text
        2. Four possible answers
        3. The correct answer index (0-3)
        Format the response as a JSON array of objects.`;

        const response = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert education content creator specializing in creating assessment questions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 2000,
        });

        return JSON.parse(response.choices[0].message.content).questions;
    }

    async suggestImprovements(questions: any[]) {
        const prompt = `Review these assessment questions and suggest improvements for clarity, difficulty balance, and educational value: ${JSON.stringify(questions)}`;

        const response = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert in educational assessment design."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    }
} 