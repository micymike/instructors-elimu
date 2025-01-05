import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CourseLevel } from '../dto/create-course.dto';
export type CourseDocument = Course & Document & {
    _id: Types.ObjectId;
};
export declare class Course {
    _id: Types.ObjectId;
    title: string;
    description: string;
    instructor: string;
    level: CourseLevel;
    modules: Array<{
        title: string;
        description: string;
        content: Array<{
            type: string;
            title: string;
            description: string;
            url?: string;
            duration?: number;
        }>;
    }>;
    status: string;
    thumbnail: string;
    duration: string;
    category: string;
    price: number;
    subject: string;
    students: string[];
    materials: Array<{
        url: string;
        name: string;
        type: 'pdf' | 'video' | 'document';
        uploadedAt: Date;
    }>;
}
export declare const CourseSchema: MongooseSchema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
