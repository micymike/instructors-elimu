import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CourseContentService } from './course-content.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Express } from 'express';

@Controller('courses/:courseId/modules/:moduleId/content')
export class CourseContentController {
  constructor(private readonly courseContentService: CourseContentService) {}

  @WebSocketServer()
  server!: Server;

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async createContent(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() createContentDto: CreateContentDto,
    @UploadedFiles() files: Express.Multer['File'][],
  ) {
    const videoFile = files.find(file => file.mimetype.startsWith('video/'));
    const pdfFile = files.find(file => file.mimetype === 'application/pdf');

    if (videoFile) {
      createContentDto.video = {
        originalname: videoFile.originalname,
        buffer: videoFile.buffer,
        mimetype: videoFile.mimetype,
      };
    }

    if (pdfFile) {
      createContentDto.pdf = {
        originalname: pdfFile.originalname,
        buffer: pdfFile.buffer,
        mimetype: pdfFile.mimetype,
      };
    }

    return this.courseContentService.createContent(courseId, moduleId, createContentDto);
  }

  @Put(':contentId')
  async updateContent(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('contentId') contentId: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    const content = await this.courseContentService.updateContent(
      courseId,
      moduleId,
      contentId,
      updateContentDto,
    );
    this.server.emit('contentUpdate', { courseId, moduleId, content });
    return content;
  }

  @Delete(':contentId')
  async deleteContent(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('contentId') contentId: string,
  ) {
    await this.courseContentService.deleteContent(courseId, moduleId, contentId);
    this.server.emit('contentUpdate', { courseId, moduleId, contentId });
    return { message: 'Content deleted successfully' };
  }

  @Get()
  async getContent(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.courseContentService.getContent(courseId, moduleId);
  }

  @Get(':contentId')
  async getContentById(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('contentId') contentId: string,
  ) {
    return this.courseContentService.getContentById(courseId, moduleId, contentId);
  }
}