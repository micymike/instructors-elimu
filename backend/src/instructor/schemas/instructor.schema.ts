import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstructorDocument = Instructor & Document;

@Schema({ timestamps: true })
export class Instructor {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }] })
    courses: Types.ObjectId[];
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor); 