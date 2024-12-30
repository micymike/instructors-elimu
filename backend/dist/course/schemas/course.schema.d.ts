import { Document, Schema as MongooseSchema } from 'mongoose';
declare class CourseItem {
    id: string;
    title: string;
    type: string;
    content?: string;
    url?: string;
}
declare class CourseSection {
    id: string;
    title: string;
    items: CourseItem[];
}
declare class Progress {
    userId: string;
    completedItems: {
        [key: string]: boolean;
    };
    lastAccessed: Date;
}
declare class Review {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}
declare class Analytics {
    enrollments: number;
    completionRate: number;
    averageRating: number;
    revenue: number;
    activeStudents: number;
}
declare class Pricing {
    amount: number;
    currency: string;
}
declare class Content {
    id: string;
    title: string;
    type: string;
    url?: string;
    content?: string;
    description?: string;
}
declare class Module {
    id: string;
    title: string;
    description?: string;
    content: Content[];
}
export declare class Course {
    title: string;
    description: string;
    instructor: string;
    sections: CourseSection[];
    progress: Progress[];
    students: string[];
    reviews: Review[];
    analytics: Analytics;
    pricing: Pricing;
    status: string;
    modules: Module[];
    content: Content[];
}
export type CourseDocument = Course & Document;
export declare const CourseSchema: MongooseSchema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface IProgress extends Progress {
}
export interface IReview extends Review {
}
export interface IAnalytics extends Analytics {
}
export interface IPricing extends Pricing {
}
export interface ICourseItem extends CourseItem {
}
export interface ICourseSection extends CourseSection {
}
export interface IContent extends Content {
}
export interface IModule extends Module {
}
export {};
