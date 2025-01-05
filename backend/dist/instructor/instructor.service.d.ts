import { Model } from 'mongoose';
import { Instructor } from '../schemas/instructor.schema';
import { UpdateInstructorDto } from '../dto/update-instructor.dto';
export declare class InstructorService {
    private instructorModel;
    constructor(instructorModel: Model<Instructor>);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateInstructorDto: UpdateInstructorDto): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProfilePicture(id: string, url: string): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getUserDetails(instructorId: string): Promise<any>;
}
