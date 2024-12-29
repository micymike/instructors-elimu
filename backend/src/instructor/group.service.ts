import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  async create(createGroupDto: {
    name: string;
    instructorId: string;
    description?: string;
    studentIds?: string[];
  }): Promise<Group> {
    const group = new this.groupModel(createGroupDto);
    return group.save();
  }

  async findByInstructor(instructorId: string): Promise<Group[]> {
    return this.groupModel.find({ instructorId }).exec();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async addStudents(groupId: string, studentIds: string[]): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    group.studentIds = [...new Set([...group.studentIds, ...studentIds])];
    return group.save();
  }

  async removeStudent(groupId: string, studentId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    group.studentIds = group.studentIds.filter(id => id !== studentId);
    return group.save();
  }

  async getGroupMeetings(groupId: string): Promise<any[]> {
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return group.meetingIds;
  }

  async update(groupId: string, updateGroupDto: any): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(groupId, updateGroupDto, { new: true });
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return group;
  }

  async delete(groupId: string): Promise<Group> {
    const group = await this.groupModel.findByIdAndDelete(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return group;
  }
}
