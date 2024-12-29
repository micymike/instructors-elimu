import { Controller, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GeminiService } from '../services/gemini.service';

interface GenerateRequestDto {
  message: string;
  context: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  access_token: string;
}

@Controller('course-generation')
export class CourseGenerationController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly jwtService: JwtService
  ) { }

  @Post('generate')
  async generateCourse(@Body() body: GenerateRequestDto): Promise<any> {
    try {
      const { message, context, access_token } = body;

      if (!context || !Array.isArray(context)) {
        throw new Error('Invalid context format');
      }

      if (!access_token) {
        throw new UnauthorizedException('Access token is missing');
      }

      // Validate JWT token
      let user;
      try {
        user = this.jwtService.verify(access_token);
      } catch (error) {
        throw new UnauthorizedException('Invalid access token');
      }

      console.log('Authenticated user:', user);

      const stage = this.geminiService.determineStage(context);
      const response = await this.geminiService.generateResponse(message, stage);

      if (stage === 'final') {
        const courseData = await this.geminiService.generateCourseStructure(context);
        return {
          message: "I've generated your course structure! You can now review and customize it.",
          courseData
        };
      }

      return { message: response };
    } catch (error) {
      console.error('Course generation error:', error);
      throw error;
    }
  }
}