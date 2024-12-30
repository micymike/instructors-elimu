import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor } from '../schemas/instructor.schema';
import { UpdateInstructorDto } from '../dto/update-instructor.dto';
import { DashboardStats } from '../types/dashboard-stats.type';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<Instructor>
  ) {}

  async findAll() {
    return this.instructorModel.find().exec();
  }

  async findOne(id: string) {
    const instructor = await this.instructorModel.findById(id).exec();
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto) {
    const updatedInstructor = await this.instructorModel
      .findByIdAndUpdate(id, updateInstructorDto, { new: true })
      .exec();
    if (!updatedInstructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return updatedInstructor;
  }

  async updateProfilePicture(id: string, url: string) {
    const updatedInstructor = await this.instructorModel
      .findByIdAndUpdate(
        id,
        { profilePicture: url },
        { new: true }
      )
      .exec();
    if (!updatedInstructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return updatedInstructor;
  }

  async remove(id: string) {
    const deletedInstructor = await this.instructorModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedInstructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return deletedInstructor;
  }

  async getDashboardStats(instructorId: string): Promise<DashboardStats> {
    // Basic implementation: return a placeholder object with some stats
    return {
      coursesCreated: 0,
      studentsEnrolled: 0,
      revenueGenerated: 0,
    };
  }
}