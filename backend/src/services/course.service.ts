import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { User } from '../users/schemas/user.schema';
import { Logger } from '@nestjs/common';
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private cloudinaryService: CloudinaryService
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto, 
    user: { id?: string, email?: string, role?: string }
  ): Promise<Course> {
    try {
      this.logger.log('🚀 Creating Course', {
        courseData: createCourseDto,
        user: user
      });

      if (!user.email) {
        throw new BadRequestException('No instructor email provided');
      }

      const createdCourse = new this.courseModel({
        ...createCourseDto,
        instructor: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedCourse = await createdCourse.save();

      this.logger.log('✅ Course Created Successfully', {
        courseId: savedCourse._id,
        title: savedCourse.title,
        instructor: user.email
      });

      return savedCourse;
    } catch (error) {
      this.logger.error('❌ Course Creation Error', {
        message: error.message,
        courseData: createCourseDto,
        user: user
      });

      throw new BadRequestException(`Failed to create course: ${error.message}`);
    }
  }

  async findAll(userId?: string): Promise<Course[]> {
    try {
      this.logger.log('🔍 Course Service - Finding Courses', { 
        userId: userId || 'Not Provided',
        timestamp: new Date().toISOString()
      });

      // If userId is provided, filter courses by this user
      let courses: Course[];
      if (userId) {
        courses = await this.courseModel.find({ instructor: userId }).exec();
        this.logger.log(`✅ Courses found for userId ${userId}:`, courses.length);
      } else {
        // Otherwise, return all courses
        courses = await this.courseModel.find().exec();
        this.logger.log('✅ Total courses found:', courses.length);
      }

      // Additional logging for debugging
      if (courses.length === 0) {
        this.logger.warn('⚠️ No courses found');
      }

      return courses;
    } catch (error) {
      this.logger.error('❌ Error in findAll method:', {
        message: error.message,
        stack: error.stack,
        userId: userId
      });

      throw new InternalServerErrorException({
        message: 'Failed to retrieve courses',
        error: error.message,
        details: {
          userId: userId,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  async findAllByEmail(email: string): Promise<Course[]> {
    try {
      this.logger.log('🔍 Course Service - Finding Courses by Email', { 
        email,
        timestamp: new Date().toISOString()
      });

      // Find courses associated with the email
      const courses = await this.courseModel.find({ 
        // Assuming the instructor field is a string or object with an email property
        $or: [
          { instructor: email },
          { 'instructor.email': email }
        ]
      }).exec();

      this.logger.log(`✅ Courses found for email ${email}:`, courses.length);

      // Additional logging for debugging
      if (courses.length === 0) {
        this.logger.warn(`⚠️ No courses found for email: ${email}`);
      }

      return courses;
    } catch (error) {
      this.logger.error('❌ Error in findAllByEmail method:', {
        message: error.message,
        stack: error.stack,
        email: email
      });

      throw new InternalServerErrorException({
        message: 'Failed to retrieve courses by email',
        error: error.message,
        details: {
          email: email,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  async getAllCourses(
    user: { id?: string, email?: string, role?: string }
  ): Promise<Course[]> {
    try {
      this.logger.log('🔍 Getting All Courses', {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // If user is an admin or has a special role, return all courses
      if (user.role === 'admin' || user.role === 'superadmin') {
        return await this.courseModel.find().exec();
      }

      // Find courses by user's ID
      const courses = await this.courseModel.find({ instructor: user.email }).exec();

      this.logger.log('✅ Courses Retrieved Successfully', {
        count: courses.length,
        userIdentifier: user.email
      });

      return courses;
    } catch (error) {
      this.logger.error('❌ Course Retrieval Error', {
        message: error.message,
        user: user
      });

      throw new Error(`Failed to retrieve courses: ${error.message}`);
    }
  }

  async findOne(id: string, instructorEmail?: string): Promise<Course> {
    try {
      const course = await this.courseModel.findOne({ 
        _id: id, 
        ...(instructorEmail && { instructor: instructorEmail }) 
      });

      if (!course) {
        throw new NotFoundException('Course not found or access denied');
      }

      return course;
    } catch (error) {
      this.logger.error('Error finding course:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve course');
    }
  }

  async getCourseStats(instructorEmail: string) {
    try {
      // Aggregate course statistics for the instructor
      const totalCourses = await this.courseModel.countDocuments({ 
        instructor: instructorEmail 
      });

      const activeCourses = await this.courseModel.countDocuments({ 
        instructor: instructorEmail, 
        status: 'published' 
      });

      const totalStudents = await this.courseModel.aggregate([
        { $match: { instructor: instructorEmail } },
        { $group: { 
            _id: null, 
            totalStudents: { $sum: { $size: '$students' } } 
          } 
        }
      ]);

      const teachingHours = await this.courseModel.aggregate([
        { $match: { instructor: instructorEmail } },
        { $group: { 
            _id: null, 
            totalHours: { $sum: { $toDouble: '$duration' } } 
          } 
        }
      ]);

      return {
        totalCourses,
        activeCourses,
        totalStudents: totalStudents[0]?.totalStudents || 0,
        teachingHours: teachingHours[0]?.totalHours || 0
      };
    } catch (error) {
      this.logger.error('Error retrieving course statistics:', error);
      throw new InternalServerErrorException('Failed to retrieve course statistics');
    }
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

    if (content.type === 'document') {
      if (!course.materials) {
        course.materials = [];
      }
      course.materials.push(content.url);
    } else {
      const module = course.modules.find((module) => module.content);
      if (!module) {
        course.modules.push({ title: '', description: '', content: [content] });
      } else {
        module.content.push(content);
      }
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

  async getCourseMaterials(courseId: string): Promise<any[]> {
    try {
      const course = await this.courseModel.findById(courseId).exec();
      
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      // Assuming course materials are stored in a field called 'materials'
      // You might need to adjust this based on your actual schema
      return course.materials || [];
    } catch (error) {
      this.logger.error('❌ Error retrieving course materials:', {
        courseId,
        errorMessage: error.message
      });

      throw new InternalServerErrorException({
        message: 'Failed to retrieve course materials',
        error: error.message
      });
    }
  }

  async addMaterial(
    courseId: string, 
    material: { 
      url: string; 
      name: string; 
      type: 'pdf' | 'video' | 'document'; 
      uploadedAt: Date; 
      isDownloadable: boolean;
      duration?: number;
      size?: number;
    }
  ): Promise<Course> {
    try {
      const course = await this.courseModel.findById(courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      course.materials.push(material);
      await course.save();

      return course;
    } catch (error) {
      this.logger.error('Failed to add material to course', error);
      throw new Error(`Failed to add material: ${error.message}`);
    }
  }

  async addCourseMaterial(
    courseId: string, 
    material: { 
      url: string; 
      name: string; 
      type: 'pdf' | 'video' | 'document'; 
      uploadedAt: Date; 
    }
  ): Promise<Course> {
    return this.addMaterial(courseId, {
      ...material,
      isDownloadable: true
    });
  }
}
