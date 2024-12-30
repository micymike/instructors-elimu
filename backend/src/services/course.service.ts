import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: string): Promise<Course> {
    const createdCourse = new this.courseModel({
      ...createCourseDto,
      instructor: userId,
    });
    return createdCourse.save();
  }

  async findAll(userId?: string): Promise<Course[]> {
    if (userId) {
      return this.courseModel.find({ instructor: userId }).exec();
    } else {
      return this.courseModel.find().exec();
    }
  }

  async findOne(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec();
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  async addContent(courseId: string, content: any): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const module = course.modules.find((module) => module.content);
    if (!module) {
      course.modules.push({ title: '', description: '', content: [content] });
    } else {
      module.content.push(content);
    }

    return course.save();
  }

  async removeContent(courseId: string, contentIndex: number): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const module = course.modules.find((module) => module.content);
    if (module) {
      module.content.splice(contentIndex, 1);
    }

    return course.save();
  }

  async updateContent(courseId: string, updateContentDto: any): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    course.modules = updateContentDto.sections;
    return course.save();
  }
}
