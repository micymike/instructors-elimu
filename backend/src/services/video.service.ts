import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument, VideoResponse } from '../schemas/video.schema';
import { CreateVideoDto, UpdateVideoDto } from '../dto/video.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    private configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async create(createVideoDto: CreateVideoDto, instructorId: string): Promise<VideoResponse> {
    const video = new this.videoModel({
      ...createVideoDto,
      instructor: instructorId,
    });
    const savedVideo = await video.save();
    return { ...savedVideo.toObject(), id: savedVideo._id.toString() };
  }

  async findAll(
    instructorId: string,
    query: {
      visibility?: string;
      tags?: string[];
      search?: string;
      page?: number;
      limit?: number;
      sort?: string;
    },
  ): Promise<{ videos: VideoResponse[]; total: number }> {
    const {
      visibility,
      tags,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = query;

    const filter: any = { instructor: instructorId };

    if (visibility) {
      filter.visibility = visibility;
    }

    if (tags && tags.length > 0) {
      filter.tags = { $all: tags };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [videos, total] = await Promise.all([
      this.videoModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('instructor', 'firstName lastName email')
        .populate('courses', 'title'),
      this.videoModel.countDocuments(filter),
    ]);

    const videosWithId = videos.map(video => ({ ...video.toObject(), id: video._id.toString() }));
    return { videos: videosWithId, total };
  }

  async findOne(id: string, instructorId: string): Promise<VideoResponse> {
    const video = await this.videoModel
      .findOne({ _id: id, instructor: instructorId })
      .populate('instructor', 'firstName lastName email')
      .populate('courses', 'title');

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return { ...video.toObject(), id: video._id.toString() };
  }

  async update(
    id: string,
    updateVideoDto: UpdateVideoDto,
    instructorId: string,
  ): Promise<VideoResponse> {
    const video = await this.videoModel.findOneAndUpdate(
      { _id: id, instructor: instructorId },
      { $set: updateVideoDto },
      { new: true },
    );

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return { ...video.toObject(), id: video._id.toString() };
  }

  async remove(id: string, instructorId: string): Promise<void> {
    const video = await this.videoModel.findOne({ _id: id, instructor: instructorId });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
    } catch (error) {
      console.error('Error deleting video from Cloudinary:', error);
    }

    await video.deleteOne();
  }

  async getCloudinarySignature(): Promise<{
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  }> {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp,
      folder: 'videos',
      resource_type: 'video',
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      this.configService.get<string>('CLOUDINARY_API_SECRET'),
    );

    return {
      signature,
      timestamp,
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      apiKey: this.configService.get<string>('CLOUDINARY_API_KEY'),
    };
  }

  async incrementViews(id: string): Promise<void> {
    await this.videoModel.updateOne(
      { _id: id },
      { $inc: { views: 1 } },
    );
  }

  async addToCourse(videoId: string, courseId: string, instructorId: string): Promise<VideoResponse> {
    const video = await this.videoModel.findOneAndUpdate(
      { _id: videoId, instructor: instructorId },
      { $addToSet: { courses: courseId } },
      { new: true },
    );

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return { ...video.toObject(), id: video._id.toString() };
  }

  async removeFromCourse(videoId: string, courseId: string, instructorId: string): Promise<VideoResponse> {
    const video = await this.videoModel.findOneAndUpdate(
      { _id: videoId, instructor: instructorId },
      { $pull: { courses: courseId } },
      { new: true },
    );

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return { ...video.toObject(), id: video._id.toString() };
  }

  async validateVideo(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      throw new BadRequestException('File size should be less than 100MB');
    }

    // Check file type
    const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed types: MP4, WebM, QuickTime');
    }
  }
}
