import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VideoService } from '../services/video.service';
import { CreateVideoDto, UpdateVideoDto, VideoResponseSwagger } from '../dto/video.dto';
import { User } from '../decorators/user.decorator';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { VideoResponse } from '../schemas/video.schema';

@ApiTags('videos')
@Controller('api/videos')
@ApiBearerAuth()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({ status: 201, description: 'Video created successfully', type: VideoResponseSwagger })
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @User('sub') instructorId: string,
  ): Promise<VideoResponseSwagger> {
    return this.videoService.create(createVideoDto, instructorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos', type: [VideoResponseSwagger] })
  async findAll(
    @User('sub') instructorId: string,
    @Query('visibility') visibility?: string,
    @Query('tags') tags?: string[],
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ): Promise<{ videos: VideoResponseSwagger[]; total: number }> {
    return this.videoService.findAll(instructorId, {
      visibility,
      tags,
      search,
      page,
      limit,
      sort,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video by id' })
  @ApiResponse({ status: 200, description: 'Return a video', type: VideoResponseSwagger })
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @User('sub') instructorId: string,
  ): Promise<VideoResponseSwagger> {
    return this.videoService.findOne(id, instructorId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a video' })
  @ApiResponse({ status: 200, description: 'Video updated successfully', type: VideoResponseSwagger })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @User('sub') instructorId: string,
  ): Promise<VideoResponseSwagger> {
    return this.videoService.update(id, updateVideoDto, instructorId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  async remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @User('sub') instructorId: string,
  ): Promise<void> {
    return this.videoService.remove(id, instructorId);
  }

  @Post('signature')
  @ApiOperation({ summary: 'Get Cloudinary upload signature' })
  @ApiResponse({ status: 200, description: 'Return upload signature' })
  async getSignature(): Promise<{
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  }> {
    return this.videoService.getCloudinarySignature();
  }

  @Post(':id/views')
  @ApiOperation({ summary: 'Increment video views' })
  @ApiResponse({ status: 200, description: 'Views incremented successfully' })
  async incrementViews(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<void> {
    return this.videoService.incrementViews(id);
  }

  @Post(':videoId/courses/:courseId')
  @ApiOperation({ summary: 'Add video to course' })
  @ApiResponse({ status: 200, description: 'Video added to course successfully', type: VideoResponseSwagger })
  async addToCourse(
    @Param('videoId', ParseObjectIdPipe) videoId: string,
    @Param('courseId', ParseObjectIdPipe) courseId: string,
    @User('sub') instructorId: string,
  ): Promise<VideoResponseSwagger> {
    return this.videoService.addToCourse(videoId, courseId, instructorId);
  }

  @Delete(':videoId/courses/:courseId')
  @ApiOperation({ summary: 'Remove video from course' })
  @ApiResponse({ status: 200, description: 'Video removed from course successfully', type: VideoResponseSwagger })
  async removeFromCourse(
    @Param('videoId', ParseObjectIdPipe) videoId: string,
    @Param('courseId', ParseObjectIdPipe) courseId: string,
    @User('sub') instructorId: string,
  ): Promise<VideoResponseSwagger> {
    return this.videoService.removeFromCourse(videoId, courseId, instructorId);
  }

  @Post('validate')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Validate video file' })
  @ApiResponse({ status: 200, description: 'Video file validated successfully' })
  async validateVideo(@UploadedFile() file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.videoService.validateVideo(file);
  }
}
