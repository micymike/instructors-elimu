import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop()
  experience: string;

  @Prop()
  education: string;

  @Prop()
  certification: string;

  @Prop({ type: [String], default: [] })
  teachingAreas: string[];

  @Prop()
  bio: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'pending', enum: ['pending', 'active', 'suspended'] })
  status: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor); 