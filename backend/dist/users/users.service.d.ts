import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    findByEmail(email: string): import("../types/user.interface").User | PromiseLike<import("../types/user.interface").User>;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: any): Promise<UserDocument>;
    findOne(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    update(id: string, updateUserDto: any): Promise<UserDocument | null>;
    updatePreferences(id: string, preferences: any): Promise<UserDocument | null>;
    addCourse(userId: string, courseId: string): Promise<UserDocument | null>;
    removeCourse(userId: string, courseId: string): Promise<UserDocument | null>;
    verifyEmail(token: string): Promise<UserDocument | null>;
    setResetPasswordToken(email: string, token: string, expires: Date): Promise<UserDocument | null>;
    resetPassword(token: string, newPassword: string): Promise<UserDocument | null>;
}
