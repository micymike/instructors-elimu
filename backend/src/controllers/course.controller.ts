import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  Req,
  UseInterceptors,
  ForbiddenException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GeminiService } from '../services/gemini.service';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../notification/notification.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { formatResponse } from '../utils/formatResponse';
import axios from 'axios';
import { Request as ExpressRequest } from 'express';
import { TokenPayload, User } from '../types/user.interface';
import { Course as CourseInterface } from '../types/course.interface';
import * as jwt from 'jsonwebtoken';
import { CourseLevel } from '../dto/create-course.dto';
import mongoose, { Types } from 'mongoose';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService,
    private readonly geminiService: GeminiService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  private async authenticateRequest(req: ExpressRequest): Promise<User> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization token');
    }

    try {
      // Extract token, handling both 'Bearer' and direct token scenarios
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : authHeader;
      
      // Decode the token without verification first
      const decoded = jwt.decode(token) as TokenPayload;
      
      if (!decoded) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Validate token expiration manually
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new UnauthorizedException('Token has expired');
      }

      // Validate required fields
      if (!decoded.email) {
        throw new UnauthorizedException('Token missing required fields');
      }

      console.log(' Token Decoded Successfully', { 
        email: decoded.email,
        isExpired: decoded.exp ? decoded.exp < currentTimestamp : false
      });

      return {
        id: decoded.sub || decoded.email,
        sub: decoded.sub || decoded.email,
        email: decoded.email,
        role: decoded.role || 'instructor'
      };
    } catch (error) {
      console.error(' Token Verification Failed', {
        error: error.message,
        name: error.name,
        stack: error.stack
      });

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get(':id/learn')
  async learn(@Param('id') id: string, @Req() req: ExpressRequest) {
    const user = await this.authenticateRequest(req);
    return { message: `Displaying course materials for course with ID ${id}` };
  }

  @Post()
  async createCourse(
    @Req() req: ExpressRequest,
    @Body() courseData: CreateCourseDto
  ): Promise<any> {
    try {
      console.log(' Course Creation Request', {
        headers: req.headers,
        body: courseData
      });

      // Authenticate the request
      const user = await this.authenticateRequest(req);

      // Validate course data
      if (!courseData.title || !courseData.description || !courseData.category) {
        throw new BadRequestException('Missing required course fields');
      }

      // Create the course
      const newCourse = await this.courseService.createCourse(courseData, { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });

      // Send notification to instructor
      try {
        await this.notificationService.create({
          userId: user.id,
          title: 'Course Created Successfully',
          message: `Your course "${courseData.title}" has been successfully created.`,
          type: 'success', // Use a valid type from the enum
          category: 'course',
          metadata: {
            courseId: newCourse._id.toString(), // Safely convert to string
            instructorId: user.id,
            actionUrl: `/courses/${newCourse._id.toString()}` // Safely convert to string
          }
        });
      } catch (notificationError) {
        // Log notification error but don't block course creation
        console.warn('Failed to create notification:', notificationError);
      }

      // Optional: Use AI to generate additional course insights
      const courseInsights = await this.generateCourseInsights(courseData);

      return {
        statusCode: 201,
        message: 'Course created successfully',
        data: {
          course: {
            ...newCourse,
            _id: newCourse._id.toString(), // Explicitly convert _id to string
            id: newCourse._id.toString() // Add id for compatibility
          },
          insights: courseInsights
        }
      };
    } catch (error) {
      console.error('Course Creation Error', {
        error: error.message,
        stack: error.stack
      });

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create course');
    }
  }

  private async generateCourseInsights(courseData: CreateCourseDto): Promise<any> {
    try {
      // Use Gemini service to generate insights
      const prompt = `Generate learning insights for a course with the following details:
        Title: ${courseData.title}
        Description: ${courseData.description}
        Category: ${courseData.category}
        Level: ${courseData.level}
        Topics: ${courseData.topics?.join(', ') || 'No specific topics'}`;

      const response = await this.geminiService.generateResponse(prompt, 'course_insights');
      
      return {
        aiGeneratedInsights: response,
        recommendedLearningPath: this.generateLearningPath(courseData)
      };
    } catch (error) {
      console.warn('Failed to generate course insights', error);
      return null;
    }
  }

  private generateLearningPath(courseData: CreateCourseDto): string[] {
    const learningPath: string[] = [];

    // Basic learning path generation logic
    switch (courseData.level) {
      case CourseLevel.BEGINNER:
        learningPath.push('Foundational Concepts');
        learningPath.push('Basic Techniques');
        learningPath.push('Practical Exercises');
        break;
      case CourseLevel.INTERMEDIATE:
        learningPath.push('Advanced Concepts');
        learningPath.push('Complex Problem Solving');
        learningPath.push('Real-world Applications');
        break;
      case CourseLevel.ADVANCED:
        learningPath.push('Expert-level Techniques');
        learningPath.push('Cutting-edge Strategies');
        learningPath.push('Mastery Projects');
        break;
    }

    return learningPath;
  }

  @Get('all')
  async getAllCourses(
    @Req() req: ExpressRequest
  ): Promise<any> {
    // Authenticate the request first
    const user = await this.authenticateRequest(req);

    try {
      const courses = await this.courseService.findAll(user.email);
      return {
        message: 'Courses retrieved successfully',
        data: courses
      };
    } catch (error) {
      console.error('Course retrieval error:', error);
      throw new InternalServerErrorException('Failed to retrieve courses');
    }
  }

  @Get('list')
  async getAllCoursesWithUser(@Req() req: ExpressRequest) {
    try {
      const user = await this.authenticateRequest(req);

      const email = user.email;

      if (!email) {
        throw new UnauthorizedException('User not authenticated or incomplete user data');
      }

      console.log(' CourseController findAll request:', {
        email,
        timestamp: new Date().toISOString()
      });
    
      const courses = await this.courseService.findAllByEmail(email);

      console.log(` Courses retrieved for ${email}:`, {
        count: courses.length
      });

      return { message: 'Courses retrieved successfully', data: courses };
    } catch (error) {
      console.error(' Error in findAll method:', {
        message: error.message,
        timestamp: new Date().toISOString()
      });
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Failed to retrieve courses',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  @Post('generate')
  async generateCourse(
    @Body() createCourseDto: CreateCourseDto, 
    @Req() req: ExpressRequest
  ): Promise<any> {
    const user = await this.authenticateRequest(req);

    const analysis = `
Course Information Analysis

Title: ${createCourseDto.title}

Description: ${createCourseDto.description}

Category: ${createCourseDto.category}

Level: ${createCourseDto.level}

Content Structure

Suggestion: Include specific topics that will be covered in the course, such as:
${createCourseDto.topics?.map(topic => `  - ${topic}`).join('\n') || '  - No topics specified'}

Learning Objectives

Suggestion: Define specific learning outcomes that students should achieve by the end of the course, such as:
  - Understand the core concepts of the course
  - Be able to apply learned skills in practical scenarios
  - Develop problem-solving skills related to the course topic

Teaching Methods
  - Interactive lectures
  - Hands-on projects
  - Peer learning
  - Real-world case studies

Recommended Resources
${createCourseDto.resources?.map(resource => `  - ${resource}`).join('\n') || '  - No resources specified'}
`;

    // Optional: Use AI to enhance the analysis
    const aiEnhancedAnalysis = await this.generateCourseInsights(createCourseDto);

    return {
      analysis,
      aiInsights: aiEnhancedAnalysis,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: ExpressRequest) {
    try {
      // Validate MongoDB ObjectId format
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid course ID format');
      }

      const user = await this.authenticateRequest(req);
      const course = await this.courseService.findOne(id);

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Check if user has access to this course
      if (course.instructor !== user.email && user.role !== 'admin') {
        throw new ForbiddenException('You do not have access to this course');
      }

      return {
        statusCode: 200,
        message: 'Course retrieved successfully',
        data: course
      };
    } catch (error) {
      console.error('Error retrieving course:', error);
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve course');
    }
  }

  @Get('instructor/stats')
  async getCourseStats(@Req() req: ExpressRequest) {
    try {
      const user = await this.authenticateRequest(req);
      
      // Fetch course statistics for the authenticated user
      const stats = await this.courseService.getCourseStats(user.email);
      
      return { 
        message: 'Course statistics retrieved successfully', 
        data: stats 
      };
    } catch (error) {
      console.error('Error retrieving course stats:', error);
      
      // Differentiate between different types of errors
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized to retrieve course statistics');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid request for course statistics');
      } else {
        throw new InternalServerErrorException('Failed to retrieve course statistics');
      }
    }
  }

  @Put(':id')
  async update(
    @Req() req: ExpressRequest,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    const user = await this.authenticateRequest(req);
    const course = await this.courseService.update(id, updateCourseDto);
    await this.notificationService.notifyCourseCreated(
      course._id.toString(), // Convert to string
      user.id,
      course.title
    );
    return { message: 'Course updated successfully', data: course };
  }

  @Put(':id/content')
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: any,
    @Req() req: ExpressRequest
  ) {
    const user = await this.authenticateRequest(req);
    const updatedCourse = await this.courseService.updateContent(id, updateContentDto);
    return { message: 'Course content updated successfully', data: updatedCourse };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: ExpressRequest) {
    const user = await this.authenticateRequest(req);
    return { message: 'Course deleted successfully', data: await this.courseService.remove(id) };
  }

  @Get(':id/content')
  async getContent(@Param('id') id: string, @Req() req: ExpressRequest) {
    const user = await this.authenticateRequest(req);
    const course = await this.courseService.findOne(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return { message: 'Course content retrieved successfully', data: course.modules };
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
      }
    })
  }))
  async uploadContent(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExpressRequest
  ) {
    const user = await this.authenticateRequest(req);
    const fileUrl = `uploads/${file.filename}`;
    const course = await this.courseService.addContent(id, {
      title: file.originalname,
      url: fileUrl,
      type: file.mimetype
    });

    return { message: 'Course content uploaded successfully', data: course };
  }

  @Post('generate-content')
  async generateContent(@Body() body: { message: string }, @Req() req: ExpressRequest) {
    const user = await this.authenticateRequest(req);
    try {
      const response = await this.geminiService.generateResponse(body.message, '');
      return { message: 'Content generated successfully', data: response };
    } catch (error) {
      console.error('Content generation error:', error);
      throw new InternalServerErrorException('Failed to generate content');
    }
  }

  @Get(':courseId/materials')
  async getCourseMaterials(@Param('courseId') courseId: string, @Req() req: ExpressRequest) {
    const user = await this.authenticateRequest(req);
    const materials = await this.courseService.getCourseMaterials(courseId);
    return { message: 'Course materials retrieved successfully', data: materials };
  }

  @Post(':courseId/materials')
  @UseInterceptors(FileInterceptor('file'))
  async addCourseMaterial(
    @Param('courseId') courseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExpressRequest
  ) {
    try {
      const user = await this.authenticateRequest(req);
      
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Upload file to Cloudinary
      const fileUrl = await this.cloudinaryService.uploadFile(file, 'course-materials');

      // Add material to course
      const course = await this.courseService.addCourseMaterial(
        courseId, 
        {
          url: fileUrl,
          name: file.originalname,
          type: this.getFileType(file.originalname),
          uploadedAt: new Date()
        }
      );

      return {
        message: 'Material added successfully',
        data: course.materials
      };
    } catch (error) {
      console.error('Error adding course material:', error);
      throw new InternalServerErrorException('Failed to add course material');
    }
  }

  private getFileType(filename: string): 'pdf' | 'video' | 'document' {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'video';
      default:
        return 'document';
    }
  }
}
