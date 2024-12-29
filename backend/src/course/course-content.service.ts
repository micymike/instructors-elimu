import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseContent, CourseContentDocument } from './course-content.schema';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

@Injectable()
export class CourseContentService {
  constructor(
    @InjectModel(CourseContent.name) private contentModel: Model<CourseContentDocument>,
  ) {}

  async createContent(courseId: string, moduleId: string, createContentDto: CreateContentDto): Promise<CourseContent> {
    let videoUrl;
    let pdfUrl;

    // Handle video upload
    if (createContentDto.video) {
      const videoData = createContentDto.video; 
      const params = {
        Bucket: process.env.S3_BUCKET_NAME || 'default-bucket-name',
        Key: `videos/${Date.now()}_${videoData.originalname}`,
        Body: videoData.buffer,
        ContentType: videoData.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      videoUrl = uploadResult.Location;
    }

    // Handle PDF upload
    if (createContentDto.pdf) {
      const pdfData = createContentDto.pdf; 
      const params = {
        Bucket: process.env.S3_BUCKET_NAME || 'default-bucket-name',
        Key: `pdfs/${Date.now()}_${pdfData.originalname}`,
        Body: pdfData.buffer,
        ContentType: pdfData.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      pdfUrl = uploadResult.Location;
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
