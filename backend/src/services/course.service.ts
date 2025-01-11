import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException,
  ForbiddenException
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
        instructor: { email: user.email },
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
        courses = await this.courseModel.find({ 'instructor.email': userId }).exec();
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
        // Ensure we're querying the correct field
        'instructor.email': email 
      }).exec();

      this.logger.log(`✅ Courses found for email ${email}:`, courses.length);

      // Additional logging for debugging
      if (courses.length === 0) {
        this.logger.warn(`⚠️ No courses found for email: ${email}`);
        
        // Optional: Log the query details for troubleshooting
        const allCourses = await this.courseModel.find().exec();
        this.logger.log('Total courses in database:', allCourses.length);
        
        // Log all course instructor emails for debugging
        const courseInstructorEmails = allCourses.map(course => 
          course.instructor?.email || 'No email'
        );
        this.logger.log('All course instructor emails:', courseInstructorEmails);
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
      const courses = await this.courseModel.find({ 'instructor.email': user.email }).exec();

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
        ...(instructorEmail && { 'instructor.email': instructorEmail }) 
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

  private parseDurationToHours(duration: { totalHours?: number; weeksDuration?: number } | null): number {
    if (!duration) return 0;
    
    // If totalHours is provided, use it directly
    if (duration.totalHours) {
      return duration.totalHours;
    }
    
    // If weeksDuration is provided, convert weeks to hours (assuming 40 hours per week)
    if (duration.weeksDuration) {
      return duration.weeksDuration * 40;
    }
    
    return 0;
  }

  async getCourseStats(instructorEmail: string) {
    try {
      // Aggregate course statistics for the instructor
      const totalCourses = await this.courseModel.countDocuments({ 
        'instructor.email': instructorEmail 
      });

      const activeCourses = await this.courseModel.countDocuments({ 
        'instructor.email': instructorEmail, 
        status: 'published' 
      });

      const totalStudents = await this.courseModel.aggregate([
        { $match: { 'instructor.email': instructorEmail } },
        { 
          $project: { 
            studentsCount: { 
              $cond: { 
                if: { $isArray: '$students' }, 
                then: { $size: '$students' }, 
                else: 0 
              } 
            } 
          } 
        },
        { 
          $group: { 
            _id: null, 
            totalStudents: { $sum: '$studentsCount' } 
          } 
        }
      ]);

      // Get all courses with their durations
      const courses = await this.courseModel.find(
        { 'instructor.email': instructorEmail },
        { duration: 1 }
      );

      // Calculate total hours using the helper function
      const totalHours = courses.reduce((acc, course) => {
        return acc + this.parseDurationToHours(course.duration);
      }, 0);

      return {
        totalCourses,
        activeCourses,
        totalStudents: totalStudents[0]?.totalStudents || 0,
        teachingHours: Number(totalHours.toFixed(2)) // Round to 2 decimal places
      };
    } catch (error) {
      this.logger.error('Error retrieving course statistics:', error);
      
      // Log detailed error information
      this.logger.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      throw new InternalServerErrorException('Failed to retrieve course statistics');
    }
  }

  async getInstructorStats(
    instructorEmail: string
  ): Promise<{
    totalCourses: number;
    activeCourses: number;
    totalStudents: number;
    teachingHours: number;
    recentActivity: any[];
    upcomingSchedule: any[];
  }> {
    try {
      this.logger.log('📊 Fetching Instructor Course Stats', {
        instructorEmail
      });

      // Aggregate total courses
      const totalCourses = await this.courseModel.countDocuments({ 
        'instructor.email': instructorEmail 
      });

      // Active courses (published)
      const activeCourses = await this.courseModel.countDocuments({ 
        'instructor.email': instructorEmail, 
        status: 'published' 
      });

      // Total students across all courses
      const studentAggregation = await this.courseModel.aggregate([
        { $match: { 'instructor.email': instructorEmail } },
        { 
          $group: { 
            _id: null, 
            totalStudents: { $sum: { $size: '$students' } } 
          } 
        }
      ]);

      // Calculate total teaching hours from course durations
      const teachingHoursAggregation = await this.courseModel.aggregate([
        { $match: { 'instructor.email': instructorEmail } },
        { 
          $group: { 
            _id: null, 
            totalTeachingHours: { 
              $sum: { 
                $ifNull: ['$duration.totalHours', 0] 
              } 
            } 
          } 
        }
      ]);

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentActivity = await this.courseModel.aggregate([
        { $match: { 
          'instructor.email': instructorEmail,
          updatedAt: { $gte: thirtyDaysAgo }
        }},
        { $project: {
          title: 1,
          status: 1,
          updatedAt: 1,
          students: { $size: '$students' }
        }},
        { $sort: { updatedAt: -1 } },
        { $limit: 5 }
      ]);

      // Upcoming live sessions
      const upcomingSchedule = await this.courseModel.aggregate([
        { $match: { 
          'instructor.email': instructorEmail,
          'liveSessions.sessionDate': { $gte: new Date() }
        }},
        { $unwind: '$liveSessions' },
        { $match: { 
          'liveSessions.sessionDate': { $gte: new Date() } 
        }},
        { $project: {
          courseTitle: '$title',
          sessionTopic: '$liveSessions.topic',
          sessionDate: '$liveSessions.sessionDate',
          startTime: '$liveSessions.startTime',
          endTime: '$liveSessions.endTime'
        }},
        { $sort: { 'sessionDate': 1 } },
        { $limit: 5 }
      ]);

      return {
        totalCourses,
        activeCourses,
        totalStudents: studentAggregation[0]?.totalStudents || 0,
        teachingHours: teachingHoursAggregation[0]?.totalTeachingHours || 0,
        recentActivity,
        upcomingSchedule
      };
    } catch (error) {
      this.logger.error('❌ Error fetching instructor stats', {
        message: error.message,
        instructorEmail
      });

      throw new InternalServerErrorException('Failed to retrieve instructor stats');
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

  async updateCourse(
    courseId: string, 
    updateCourseDto: UpdateCourseDto, 
    user: { id?: string, email?: string, role?: string }
  ): Promise<Course> {
    try {
      this.logger.log('🔄 Updating Course', {
        courseId,
        updateData: updateCourseDto,
        user: user
      });

      // Find the existing course
      const course = await this.courseModel.findById(courseId);

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Check if user has permission to update
      if (user.role !== 'admin' && course.instructor.email !== user.email) {
        throw new ForbiddenException('You do not have permission to update this course');
      }

      // Update course
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        courseId, 
        { 
          ...updateCourseDto,
          updatedAt: new Date()
        }, 
        { new: true }
      );

      if (!updatedCourse) {
        throw new InternalServerErrorException('Failed to update course');
      }

      this.logger.log('✅ Course Updated Successfully', {
        courseId: updatedCourse._id,
        title: updatedCourse.title
      });

      return updatedCourse;
    } catch (error) {
      this.logger.error('❌ Course Update Error', {
        message: error.message,
        courseId,
        user: user
      });

      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update course');
    }
  }

  async updateCourseContent(
    courseId: string, 
    contentData: any, 
    user: { id?: string, email?: string, role?: string }
  ): Promise<Course> {
    try {
      this.logger.log('🔄 Updating Course Content', {
        courseId,
        contentData,
        user: user
      });

      // Validate course ownership or admin rights
      const course = await this.findOne(courseId, user.email);

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Check if user has permission to update
      if (user.role !== 'admin' && course.instructor.email !== user.email) {
        throw new ForbiddenException('You do not have permission to update this course content');
      }

      // Update specific content fields
      const updateObject = {
        ...contentData,
        updatedAt: new Date()
      };

      // Remove undefined fields to prevent overwriting with undefined
      Object.keys(updateObject).forEach(key => 
        updateObject[key] === undefined && delete updateObject[key]
      );

      // Update course content
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        courseId, 
        { $set: updateObject }, 
        { new: true, runValidators: true }
      );

      if (!updatedCourse) {
        throw new InternalServerErrorException('Failed to update course content');
      }

      this.logger.log('✅ Course Content Updated Successfully', {
        courseId: updatedCourse._id,
        updatedFields: Object.keys(updateObject)
      });

      return updatedCourse;
    } catch (error) {
      this.logger.error('❌ Course Content Update Error', {
        message: error.message,
        courseId,
        user: user.email
      });

      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(`Failed to update course content: ${error.message}`);
    }
  }

  async deleteCourse(
    courseId: string, 
    user: { id?: string, email?: string, role?: string }
  ): Promise<void> {
    try {
      this.logger.log('🗑️ Deleting Course', {
        courseId,
        user: user
      });

      // Find the existing course
      const course = await this.courseModel.findById(courseId);

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Check if user has permission to delete
      if (user.role !== 'admin' && course.instructor.email !== user.email) {
        throw new ForbiddenException('You do not have permission to delete this course');
      }

      // Delete course
      const result = await this.courseModel.findByIdAndDelete(courseId);

      if (!result) {
        throw new InternalServerErrorException('Failed to delete course');
      }

      this.logger.log('✅ Course Deleted Successfully', {
        courseId
      });
    } catch (error) {
      this.logger.error('❌ Course Deletion Error', {
        message: error.message,
        courseId,
        user: user
      });

      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete course');
    }
  }
}
