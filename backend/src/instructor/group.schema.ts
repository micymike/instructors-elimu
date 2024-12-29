import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name: string = '';

  @Prop({ required: true })
  instructorId: string = '';

  @Prop({ type: [String], default: [] })
  studentIds: string[] = [];

  @Prop({ type: [String], default: [] })
  meetingIds: string[] = [];

  @Prop({ default: Date.now })
  createdAt: Date = new Date();

  @Prop({ default: Date.now })
  updatedAt: Date = new Date();
}

export const GroupSchema = SchemaFactory.createForClass(Group);