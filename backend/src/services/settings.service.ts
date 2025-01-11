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
          phone: instructor.phoneNumber,
          expertise: instructor.expertise,
          bio: instructor.bio,
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

  async updateUserSettings(email: string, settingsData: any) {
    try {
      this.logger.log(`Attempting to update settings for email: ${email}`);
      this.logger.log(`Update data: ${JSON.stringify(settingsData)}`);

      // Validate email
      if (!email) {
        this.logger.error('No email provided');
        throw new InternalServerErrorException('Email is required');
      }

      // Find and update instructor
      const updateFields = settingsData.personalInfo || settingsData;
      
      const updatedInstructor = await this.instructorModel.findOneAndUpdate(
        { email },
        { 
          $set: {
            firstName: updateFields.firstName,
            lastName: updateFields.lastName,
            phoneNumber: updateFields.phone,
            expertise: updateFields.expertise,
            bio: updateFields.bio,
            profilePicture: updateFields.profilePicture
          }
        },
        { 
          new: true,  // Return the updated document
          runValidators: true  // Run mongoose validation
        }
      );

      if (!updatedInstructor) {
        this.logger.error(`No instructor found with email: ${email}`);
        throw new InternalServerErrorException(`Instructor not found with email: ${email}`);
      }

      this.logger.log(`Instructor updated successfully: ${JSON.stringify(updatedInstructor)}`);

      // Return sanitized updated settings
      return {
        personalInfo: {
          firstName: updatedInstructor.firstName,
          lastName: updatedInstructor.lastName,
          email: updatedInstructor.email,
          phone: updatedInstructor.phoneNumber,
          expertise: updatedInstructor.expertise,
          bio: updatedInstructor.bio,
          profilePicture: updatedInstructor.profilePicture
        },
        preferences: {
          notifications: true, // Default preferences since they're not in the schema
          language: 'en',
          theme: 'light'
        },
        teachingProfile: {
          phoneNumber: updatedInstructor.phoneNumber,
          experience: updatedInstructor.experience,
          education: updatedInstructor.education,
          certification: updatedInstructor.certification,
          teachingAreas: updatedInstructor.teachingAreas,
          bio: updatedInstructor.bio
        }
      };
    } catch (error) {
      this.logger.error(`Comprehensive error updating instructor settings for ${email}`, {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        email: email
      });

      // Rethrow with more context
      throw new InternalServerErrorException({
        message: 'Failed to update instructor settings',
        details: {
          email: email,
          errorMessage: error.message
        }
      });
    }
  }
}
