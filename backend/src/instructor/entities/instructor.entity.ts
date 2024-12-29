import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Instructor extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ required: true })
  expertise: string;

  @Prop({ required: true })
  experience: string;

  @Prop({ required: true })
  education: string;

  @Prop()
  certification?: string;

  @Prop({ type: [{ type: String }] })
  teachingAreas: string[];

  @Prop({ type: String })
  bio: string;

  @Prop({ type: Object })
  socialLinks: {
    [key: string]: string;
  };

  @Prop()
  avatarUrl?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    expertise: string,
    experience: string,
    education: string,
    teachingAreas: string[] = [],
    bio: string = '',
    socialLinks: { [key: string]: string } = {},
    isVerified: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    phoneNumber?: string,
    certification?: string,
    avatarUrl?: string,
  ) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.expertise = expertise;
    this.experience = experience;
    this.education = education;
    this.teachingAreas = teachingAreas;
    this.bio = bio;
    this.socialLinks = socialLinks;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.phoneNumber = phoneNumber;
    this.certification = certification;
    this.avatarUrl = avatarUrl;
  }
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
