import { Module } from '@nestjs/common';
import { InstructorService } from '../services/instructor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Instructor, InstructorSchema } from '../schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }])
  ],
  providers: [InstructorService],
  exports: [InstructorService]
})
export class InstructorModule {}
