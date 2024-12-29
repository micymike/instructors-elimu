import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstructorController } from '../instructor/instructor.controller';
import { InstructorService } from '../services/instructor.service';
import { S3Service } from '../services/s3.service';
import { Instructor, InstructorSchema } from '../schemas/instructor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instructor.name, schema: InstructorSchema }
    ])
  ],
  controllers: [InstructorController],
  providers: [InstructorService, S3Service],
  exports: [InstructorService]
})
export class InstructorModule {} 