import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Instructor } from '../instructor.entity';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  async findAll(): Promise<Instructor[]> {
    return this.instructorRepository.find();
  }

  async findOne(id: string): Promise<Instructor> {
    return this.instructorRepository.findOne({ where: { id } });
  }

  async update(id: string, updateInstructorDto: any): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({ where: { id } });
    if (!instructor) {
      throw new Error('Instructor not found');
    }
    Object.assign(instructor, updateInstructorDto);
    return this.instructorRepository.save(instructor);
  }

  async remove(id: string): Promise<void> {
    await this.instructorRepository.delete(id);
  }

  async getDashboardStats(instructorId: string): Promise<any> {
    // TO DO: implement logic to retrieve dashboard stats for the instructor
    return {};
  }
}
