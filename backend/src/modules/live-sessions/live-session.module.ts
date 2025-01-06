import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveSessionService } from './live-session.service';
import { LiveSessionController } from './live-session.controller';
import { ZoomModule } from '../../zoom/zoom.module';
import { Course, CourseSchema } from '../../schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ZoomModule
  ],
  controllers: [LiveSessionController],
  providers: [LiveSessionService],
  exports: [LiveSessionService]
})
export class LiveSessionModule {}
