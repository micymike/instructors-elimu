import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from '../controllers/course.controller';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { GeminiService } from '../services/gemini.service';
import { Course, CourseSchema } from '../schemas/course.schema';
import { NotificationModule } from '../notification/notification.module';
import { AIModule } from '../ai/ai.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    NotificationModule,
    AIModule,
    CloudinaryModule
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    NotificationService,
    GeminiService,
    CloudinaryService
  ],
  exports: [
    CourseService, 
    NotificationService, 
    GeminiService,
    CloudinaryService
  ]
})
export class CourseGenerationModule {}
