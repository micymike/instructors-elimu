import { Document, Schema as MongooseSchema } from 'mongoose';
export type CourseDocument = Course & Document;
export declare class Course {
    title: string;
    description: string;
    instructor: string;
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
    level: string;
    category: string;
    students: string[];
}
export declare const CourseSchema: MongooseSchema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
