import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from '../schemas/instructor.schema';
import { User } from '../types/user.interface';
export declare class UserService {
    private instructorModel;
    private readonly logger;
    constructor(instructorModel: Model<InstructorDocument>);
    getUser(): Promise<Instructor>;
    findByEmail(email: string): Promise<User | null>;
}
