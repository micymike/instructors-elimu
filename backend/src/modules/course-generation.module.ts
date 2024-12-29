import { Module } from '@nestjs/common';
import { CourseGenerationController } from '../controllers/course-generation.controller';
import { GeminiService } from '../services/gemini.service';

@Module({
  controllers: [CourseGenerationController],
  providers: [GeminiService],
})
export class CourseGenerationModule {} 