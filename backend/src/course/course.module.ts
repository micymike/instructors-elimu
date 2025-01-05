import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from '../controllers/course.controller';
import { CourseService } from '../services/course.service';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Instructor, InstructorSchema } from '../schemas/instructor.schema';
import { NotificationModule } from '../notification/notification.module';
import { AIModule } from '../ai/ai.module';
import { CloudinaryModule } from '../modules/cloudinary/cloudinary.module';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Instructor.name, schema: InstructorSchema }
    ]),
    NotificationModule,
    AIModule,
    CloudinaryModule,
  ],
  controllers: [CourseController],
  providers: [CourseService, CloudinaryService],
  exports: [CourseService]
})
export class CourseModule {}
