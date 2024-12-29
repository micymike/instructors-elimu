import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { Instructor } from './instructor.entity';
import { AuthModule } from '../auth/auth.module';
import { S3Service } from '../services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor]),
    AuthModule,
  ],
  controllers: [InstructorController],
  providers: [InstructorService, S3Service],
  exports: [InstructorService],
})
export class InstructorModule {}
