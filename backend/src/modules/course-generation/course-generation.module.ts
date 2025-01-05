import { Module } from '@nestjs/common';
import { CourseGenerationService } from './course-generation.service';
import { CourseController } from '../../controllers/course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../../schemas/course.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIModule } from '../../ai/ai.module';
import { AIService } from '../../ai/ai.service';
import { GeminiService } from '../../services/gemini.service';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../notification/notification.service';
import { NotificationModule } from '../../notification/notification.module';
import { CourseModule } from '../../course/course.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
        CourseModule,
        NotificationModule,
        AIModule
    ],
    controllers: [CourseController],
    providers: [
        CourseGenerationService, 
        AIService, 
        GeminiService, 
        CourseService,
        NotificationService
    ],
    exports: [CourseGenerationService],
})
export class CourseGenerationModule { }