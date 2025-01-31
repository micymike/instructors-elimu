import { Document } from 'mongoose';
export declare class Instructor extends Document {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    expertise: string;
    experience: string;
    education: string;
    certification?: string;
    teachingAreas: string[];
    bio: string;
    socialLinks: {
        [key: string]: string;
    };
    avatarUrl?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(id: string, firstName: string, lastName: string, email: string, password: string, expertise: string, experience: string, education: string, teachingAreas?: string[], bio?: string, socialLinks?: {
        [key: string]: string;
    }, isVerified?: boolean, createdAt?: Date, updatedAt?: Date, phoneNumber?: string, certification?: string, avatarUrl?: string);
}
export declare const InstructorSchema: import("mongoose").Schema<Instructor, import("mongoose").Model<Instructor, any, any, any, Document<unknown, any, Instructor> & Instructor & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Instructor, Document<unknown, {}, import("mongoose").FlatRecord<Instructor>> & import("mongoose").FlatRecord<Instructor> & {
    _id: import("mongoose").Types.ObjectId;
}>;
