import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseWizardService } from './course-wizard.service';
import { Course, CourseSchema } from './schemas/course.schema';
import { AIModule } from '../ai/ai.module';
import { GeminiService } from '../ai/gemini.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    AIModule
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseWizardService, GeminiService],
  exports: [CourseService, CourseWizardService]
})
export class CourseModule { }
