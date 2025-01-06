import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor } from '../schemas/instructor.schema';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<Instructor>
  ) {}

  async getUserSettings(email: string) {
    try {
      this.logger.log(`Attempting to retrieve settings for email: ${email}`);

      // Validate email
      if (!email) {
        this.logger.error('No email provided');
        throw new InternalServerErrorException('Email is required');
      }

      // Check database connection
      try {
        await this.instructorModel.db.db.admin().ping();
        this.logger.log('Database connection is active');
      } catch (connectionError) {
        this.logger.error('Database connection failed', connectionError);
        throw new InternalServerErrorException('Database connection error');
      }

      // Find instructor by email
      const instructor = await this.instructorModel.findOne({ email }).lean();

      this.logger.log(`Instructor query result: ${JSON.stringify(instructor)}`);

      if (!instructor) {
        this.logger.error(`No instructor found with email: ${email}`);
        
        // Fetch all instructors to help diagnose the issue
        const allInstructors = await this.instructorModel.find({}, { email: 1 }).lean();
        this.logger.log(`Existing instructors: ${JSON.stringify(allInstructors.map(i => i.email))}`);

        throw new InternalServerErrorException(`Instructor not found with email: ${email}`);
      }

      // Return a sanitized settings object
      return {
        personalInfo: {
          firstName: instructor.firstName,
          lastName: instructor.lastName,
          email: instructor.email,
          role: instructor.status === 'active' ? 'instructor' : 'pending',
          isVerified: instructor.isVerified,
          expertise: instructor.expertise,
          profilePicture: instructor.profilePicture
        },
        preferences: {
          notifications: true, // Default preferences since they're not in the schema
          language: 'en',
          theme: 'light'
        },
        teachingProfile: {
          phoneNumber: instructor.phoneNumber,
          experience: instructor.experience,
          education: instructor.education,
          certification: instructor.certification,
          teachingAreas: instructor.teachingAreas,
          bio: instructor.bio
        }
      };
    } catch (error) {
      this.logger.error(`Comprehensive error retrieving instructor settings for ${email}`, {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        email: email
      });

      // Rethrow with more context
      throw new InternalServerErrorException({
        message: 'Failed to retrieve instructor settings',
        details: {
          email: email,
          errorMessage: error.message
        }
      });
    }
  }
}
