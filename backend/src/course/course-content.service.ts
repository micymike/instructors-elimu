import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseContent, CourseContentDocument } from './course-content.schema';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

@Injectable()
export class CourseContentService {
  constructor(
    @InjectModel(CourseContent.name) private contentModel: Model<CourseContentDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createContent(courseId: string, moduleId: string, createContentDto: CreateContentDto): Promise<CourseContent> {
    let videoUrl;
    let pdfUrl;

    // Handle video upload using Cloudinary
    if (createContentDto.video) {
      videoUrl = await this.cloudinaryService.uploadVideo(createContentDto.video, 'course-videos');
    }

    // Handle PDF upload using Cloudinary
    if (createContentDto.pdf) {
      pdfUrl = await this.cloudinaryService.uploadFile(createContentDto.pdf, 'course-pdfs');
    }

    const newContent = new this.contentModel({ ...createContentDto, courseId, moduleId, videoUrl, pdfUrl });
    return newContent.save();
  }

  async updateContent(courseId: string, moduleId: string, contentId: string, updateContentDto: UpdateContentDto): Promise<CourseContent> {
    const existingContent = await this.contentModel.findOneAndUpdate(
      { _id: contentId, courseId, moduleId },
      updateContentDto,
      { new: true },
    );

    if (!existingContent) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    return existingContent;
  }

  async deleteContent(courseId: string, moduleId: string, contentId: string): Promise<void> {
    const result = await this.contentModel.deleteOne({ _id: contentId, courseId, moduleId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
  }

  async getContent(courseId: string, moduleId: string): Promise<CourseContent[]> {
    return this.contentModel.find({ courseId, moduleId }).exec();
  }

  async getContentById(courseId: string, moduleId: string, contentId: string): Promise<CourseContent> {
    const content = await this.contentModel.findOne({ _id: contentId, courseId, moduleId }).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
    return content;
  }
}
