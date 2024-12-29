import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Group extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    instructorId: string;

    @Prop()
    description?: string;

    @Prop({ type: [String] })
    studentIds?: string[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
