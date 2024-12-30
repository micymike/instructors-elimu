import { Document } from 'mongoose';
export type CourseContentDocument = CourseContent & Document;
export declare class CourseContent {
    courseId: string;
    title: string;
    description: string;
    moduleIndex: number;
    contentIndex: number;
    videoUrl?: string;
    pdfUrl?: string;
    materials: string[];
    prerequisites: string[];
}
export declare const CourseContentSchema: import("mongoose").Schema<CourseContent, import("mongoose").Model<CourseContent, any, any, any, Document<unknown, any, CourseContent> & CourseContent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CourseContent, Document<unknown, {}, import("mongoose").FlatRecord<CourseContent>> & import("mongoose").FlatRecord<CourseContent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
