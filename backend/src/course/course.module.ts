import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from '../controllers/course.controller';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { GeminiService } from '../ai/gemini.service';
import { Course, CourseSchema } from '../schemas/course.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema }
    ]),
    NotificationModule, // Import NotificationModule
  ],
  controllers: [CourseController],
  providers: [CourseService, NotificationService, GeminiService],
  exports: [CourseService]
})
export class CourseModule {}
