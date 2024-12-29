import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Request 
} from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../services/notification.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import formatResponse from '../utils/formatResponse';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService
  ) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    // Temporarily remove JWT validation for course creation
    const course = await this.courseService.create(createCourseDto, 'temporary-user-id');
    await this.notificationService.notifyCourseCreation(
      'temporary-user-id',
      course.title
    );
    return formatResponse(course);
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
  async findAll(@Request() req: RequestWithUser) {
    return this.courseService.findAll(req.user.sub);
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
    await this.notificationService.notifyCourseUpdate(
      req.user.sub,
      course.title
    );
    return course;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
