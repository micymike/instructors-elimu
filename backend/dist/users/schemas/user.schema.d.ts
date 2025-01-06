import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    expertise: string;
    profilePicture: string;
    isVerified: boolean;
    verificationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    isActive: boolean;
    courses: string[];
    preferences: {
        notifications: boolean;
        language: string;
        theme: string;
    };
    emailVerificationToken: string;
    emailVerificationTokenExpires: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
