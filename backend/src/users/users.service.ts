import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: any): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword
    });
    return createdUser.save();
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: any): Promise<UserDocument | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async updatePreferences(id: string, preferences: any): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { preferences }, { new: true })
      .exec();
  }

  async addCourse(userId: string, courseId: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { courses: courseId } },
        { new: true }
      )
      .exec();
  }

  async removeCourse(userId: string, courseId: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { courses: courseId } },
        { new: true }
      )
      .exec();
  }

  async verifyEmail(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate(
        { verificationToken: token },
        { isVerified: true, verificationToken: null },
        { new: true }
      )
      .exec();
  }

  async setResetPasswordToken(email: string, token: string, expires: Date): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate(
        { email },
        {
          resetPasswordToken: token,
          resetPasswordExpires: expires
        },
        { new: true }
      )
      .exec();
  }

  async resetPassword(token: string, newPassword: string): Promise<UserDocument | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel
      .findOneAndUpdate(
        {
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: new Date() }
        },
        {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        },
        { new: true }
      )
      .exec();
  }
}
