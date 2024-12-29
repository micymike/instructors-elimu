import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ModuleContent {
  type: string;
  title: string;
  description: string;
}

interface CourseModule {
  title: string;
  description: string;
  content: ModuleContent[];
}

interface CourseStructure {
  title: string;
  description: string;
  modules: CourseModule[];
  level: string;
  duration: string;
  category: string;
}

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

  async generateResponse(message: string, stage: string): Promise<string> {
    try {
      let prompt = '';

      switch (stage) {
        case 'subject':
          prompt = `You are a course creation assistant. The user wants to create a course about: "${message}".
                   Ask them about their target audience and experience level.`;
          break;

        case 'audience':
          prompt = `Based on the target audience: "${message}",
                   Ask about specific learning objectives they want to achieve.`;
          break;

        case 'objectives':
          prompt = `Given these learning objectives: "${message}",
                   Ask about the preferred course duration and time commitment.`;
          break;

        case 'duration':
          prompt = `With the duration being: "${message}",
                   Let them know you'll generate a course structure now.`;
          break;

        case 'final':
          return "Great! I'll now generate a detailed course structure for you.";
      }

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  async generateCourseStructure(context: Array<{ role: string; content: string }>) {
    try {
      const userInputs = context
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content);

      const [subject, audience, objectives, duration] = userInputs;

      const prompt = `
        Create a detailed course structure based on this information:
        Subject: ${subject}
        Target Audience: ${audience}
        Learning Objectives: ${objectives}
        Duration: ${duration}
        // ... rest of your prompt ...
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const cleanedResponse = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/[\u201C\u201D]/g, '"')
        .trim();

      const parsedData = JSON.parse(cleanedResponse);

      if (!this.validateCourseStructure(parsedData)) {
        throw new Error('Generated course structure is invalid');
      }

      return parsedData;
    } catch (error) {
      console.error('Course generation error:', error);
      throw new Error('Failed to generate course structure');
    }
  }

  private validateCourseStructure(data: any): data is CourseStructure {
    try {
      // Basic structure check
      if (!data || typeof data !== 'object') return false;

      // Required fields check
      const requiredFields = ['title', 'description', 'modules', 'level', 'duration', 'category'];
      if (!requiredFields.every(field => field in data)) return false;

      // Type checks
      if (typeof data.title !== 'string' ||
        typeof data.description !== 'string' ||
        !Array.isArray(data.modules) ||
        typeof data.level !== 'string' ||
        typeof data.duration !== 'string' ||
        typeof data.category !== 'string') {
        return false;
      }

      // Modules validation
      return data.modules.every((module: CourseModule) =>
        typeof module.title === 'string' &&
        typeof module.description === 'string' &&
        Array.isArray(module.content) &&
        module.content.every((content: ModuleContent) =>
          typeof content.type === 'string' &&
          ['video', 'document', 'quiz', 'assignment'].includes(content.type) &&
          typeof content.title === 'string' &&
          typeof content.description === 'string'
        )
      );
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }

  determineStage(context: Array<{ role: string; content: string }>) {
    if (!context || !Array.isArray(context)) {
      return 'subject';
    }

    const messages = context.map(msg => msg.content.toLowerCase());

    if (!messages.some(msg => msg.includes('subject'))) return 'subject';
    if (!messages.some(msg => msg.includes('audience'))) return 'audience';
    if (!messages.some(msg => msg.includes('objectives'))) return 'objectives';
    if (!messages.some(msg => msg.includes('duration'))) return 'duration';
    return 'final';
  }
}