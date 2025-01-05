import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from '../schemas/instructor.schema';
import { User } from '../types/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>) {}

  async getUser(): Promise<Instructor> {
    return this.instructorModel.findOne();
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        this.logger.warn('Attempted to find user with empty email');
        return null;
      }

      const instructor = await this.instructorModel.findOne({ email }).lean();

      if (!instructor) {
        this.logger.log(`No instructor found with email: ${email}`);
        return null;
      }

      return {
        id: instructor._id?.toString() || '',
        sub: instructor._id?.toString() || '',
        email: instructor.email,
        // Derive role based on status or other attributes
        role: instructor.status === 'active' ? 'instructor' : 'pending'
      };
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
      return null;
    }
  }
}
