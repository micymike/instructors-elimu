import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreateCourseDto } from '../dto/create-course.dto';

@Injectable()
export class GeminiService implements OnModuleInit {
  private model: any;

  constructor(private configService: ConfigService) { }

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(prompt: string, context: string) {
    try {
      if (!this.model) {
        throw new Error('Gemini model not initialized');
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate content');
    }
  }

  async generateCourse(createCourseDto: CreateCourseDto) {
    try {
      const prompt = `Generate a detailed course structure for a ${createCourseDto.level} level course on ${createCourseDto.subject}. Include:
        1. Course title
        2. Course description
        3. Learning objectives
        4. Syllabus with modules and lessons
        5. Suggested schedule
        6. Assessment methods
        7. Required resources`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse the generated content into a structured format
      return {
        title: createCourseDto.subject,
        description: text,
        level: createCourseDto.level,
        generated: true,
        content: text,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating course:', error);
      throw new Error('Failed to generate course content');
    }
  }
}
