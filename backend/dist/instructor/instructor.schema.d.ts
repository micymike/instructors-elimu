import { Document } from 'mongoose';
export type InstructorDocument = Instructor & Document;
export declare class Instructor {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    expertise: string;
    experience: string;
    education: string;
    certification: string;
    teachingAreas: string[];
    bio: string;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
    profilePicture: string;
    isVerified: boolean;
    status: string;
    courses: string[];
    analytics: {
        totalStudents?: number;
        averageRating?: number;
        totalCourses?: number;
        totalRevenue?: number;
    };
    validatePassword(password: string): Promise<boolean>;
}
export declare const InstructorSchema: import("mongoose").Schema<Instructor, import("mongoose").Model<Instructor, any, any, any, Document<unknown, any, Instructor> & Instructor & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Instructor, Document<unknown, {}, import("mongoose").FlatRecord<Instructor>> & import("mongoose").FlatRecord<Instructor> & {
    _id: import("mongoose").Types.ObjectId;
}>;
