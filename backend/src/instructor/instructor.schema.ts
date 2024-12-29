import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CallbackError } from 'mongoose';

export type InstructorDocument = Instructor & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class Instructor {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  expertise: string;

  @Prop({ required: false })
  experience: string;

  @Prop({ required: false })
  education: string;

  @Prop()
  certification: string;

  @Prop({ type: [String], required: false, default: [] })
  teachingAreas: string[];

  @Prop({ required: false })
  bio: string;

  @Prop({
    type: {
      linkedin: String,
      twitter: String,
      website: String,
    },
  })
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };

  @Prop()
  profilePicture: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'pending', enum: ['pending', 'active', 'suspended'] })
  status: string;

  @Prop({ type: [{ type: String, ref: 'Course' }] })
  courses: string[];

  @Prop({ type: Object })
  analytics: {
    totalStudents?: number;
    averageRating?: number;
    totalCourses?: number;
    totalRevenue?: number;
  };

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);

// Add validatePassword to schema methods
InstructorSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Pre-save middleware for password hashing
InstructorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});
