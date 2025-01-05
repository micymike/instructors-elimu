import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { GeminiService } from '../services/gemini.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private geminiService: GeminiService,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<CourseDocument> {
    const courseData = typeof createCourseDto.courseData === 'string'
      ? JSON.parse(createCourseDto.courseData)
      : createCourseDto.courseData;

    if (!courseData) {
      throw new BadRequestException('Course data is required');
    }

    const course = new this.courseModel(courseData);
    return course.save();
  }

  async findAll(): Promise<CourseDocument[]> {
    return this.courseModel.find().exec();
  }

  async findOne(id: string): Promise<CourseDocument> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async generateLearningObjectives(subject: string, level: string) {
    const prompt = `Create specific learning objectives for ${subject} at ${level} level, following Bloom's taxonomy.`;
    return this.geminiService.generateResponse(prompt, 'objectives');
  }

  async generateCourseSchedule(subject: string, level: string) {
    const prompt = `Create a detailed course schedule for ${subject} at ${level} level.`;
    return this.geminiService.generateResponse(prompt, 'schedule');
  }

  async generateAssessments(subject: string, level: string) {
    const prompt = `Create comprehensive assessment plan for ${subject} at ${level} level.`;
    return this.geminiService.generateResponse(prompt, 'assessments');
  }
}
