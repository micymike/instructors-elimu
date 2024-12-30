import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Request,
  UseInterceptors,
  UploadedFile,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GeminiService } from 'src/ai/gemini.service';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { formatResponse } from '../utils/formatResponse';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('api/courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService,
    private readonly geminiService: GeminiService
  ) {}

  @Get(':id/learn')
  async learn(@Param('id') id: string) {
    return `Displaying course materials for course with ID ${id}`;
  }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    const course = await this.courseService.create(createCourseDto, 'temporary-user-id');
    await this.notificationService.notifyCourseCreated(
      course['_id'],
      'temporary-user-id',
      course.title
    );
    return formatResponse(course);
  }
  
  @Post('course-generation')
  async generateCourse(@Body() createCourseDto: CreateCourseDto) {
    const generatedCourse = await this.geminiService.generateCourse(createCourseDto);
    return formatResponse(generatedCourse);
  }

  @Post('analyze')
  async analyze(@Body() createCourseDto: CreateCourseDto) {
    const analysis = `
Course Information Analysis

Title: ${createCourseDto.title}

Description: ${createCourseDto.description}

Category: ${createCourseDto.category}

Level: ${createCourseDto.level}

Duration: ${createCourseDto.duration}

Content Structure

Suggestion: Include specific topics that will be covered in the course, such as:
  - Introduction to Python
  - Data types and variables
  - Control flow (if-else, loops)
  - Functions
  - Object-oriented programming basics

Learning Objectives

Suggestion: Define specific learning outcomes that students should achieve by the end of the course, such as:
  - Understand the basic concepts of programming
  - Be able to write simple Python programs
  - Understand how to use data structures and algorithms
  - Develop problem-solving skills

Teaching Methods

Suggestion: Include a variety of teaching methods to accommodate different learning styles, such as:
  - Lectures
  - Hands-on coding exercises
  - Discussions
  - Quizzes

Assessment Strategies

Suggestion: Use a combination of assessment strategies to evaluate student progress, such as:
  - Weekly assignments
  - Midterm exam
  - Final project
    `;
    return formatResponse(analysis);
  }

@Get()
async findAll(@Request() req: any) {
  if (req.user) {
    return this.courseService.findAll(req.user.sub);
  } else {
    return this.courseService.findAll();
  }
}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    const course = await this.courseService.update(id, updateCourseDto);
    await this.notificationService.notifyCourseCreated(
      course['_id'],
      req.user.sub,
      course.title
    );
    return course;
  }

  @Put(':id/content')
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: any
  ) {
    const updatedCourse = await this.courseService.updateContent(id, updateContentDto);
    return formatResponse(updatedCourse);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }

  @Get(':id/content')
  async getContent(@Param('id') id: string) {
    const course = await this.courseService.findOne(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
      }
    })
  }))
  async uploadContent(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileUrl = `uploads/${file.filename}`;
    const course = await this.courseService.addContent(id, {
      title: file.originalname,
      type: file.mimetype,
      url: fileUrl
    });
    return course;
  }
}
