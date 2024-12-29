import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ type: [String], default: [] })
  studentIds: string[];

  @Prop({ type: [String], default: [] })
  meetingIds: string[];

  @Prop({ type: String })
  description?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  constructor(
    name: string,
    instructorId: string,
    studentIds: string[] = [],
    meetingIds: string[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    description?: string,
  ) {
    super();
    this.name = name;
    this.instructorId = instructorId;
    this.studentIds = studentIds;
    this.meetingIds = meetingIds;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.description = description;
  }
}

export const GroupSchema = SchemaFactory.createForClass(Group);
