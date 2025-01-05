import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService implements OnModuleInit {
  private model: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(prompt: string, stage: string = ''): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error(`Failed to generate ${stage} response`);
    }
  }

  async generateCourse(courseData: any): Promise<any> {
    const prompt = `Generate a comprehensive course structure for a course with the following details:
      Title: ${courseData.title}
      Description: ${courseData.description}
      Category: ${courseData.category}
      Level: ${courseData.level}
      Duration: ${courseData.duration}

      Please provide a detailed outline including:
      1. Course objectives
      2. Modules/Sections
      3. Learning outcomes
      4. Assessment methods
    `;

    try {
      const result = await this.model.generateContent(prompt);
      return {
        title: courseData.title,
        description: result.response.text(),
        ...courseData
      };
    } catch (error) {
      console.error('Error generating course:', error);
      throw new Error('Failed to generate course structure');
    }
  }

  determineStage(context: any[]): string {
    // Basic implementation to determine conversation stage
    if (!context || context.length === 0) return 'subject';
    
    const messages = context.map(msg => msg.content.toLowerCase());
    
    if (!messages.some(msg => msg.includes('subject'))) return 'subject';
    if (!messages.some(msg => msg.includes('audience'))) return 'audience';
    if (!messages.some(msg => msg.includes('duration'))) return 'duration';
    if (!messages.some(msg => msg.includes('objectives'))) return 'objectives';
    
    return 'final';
  }
}
