import { Model } from 'mongoose';
import { Instructor } from '../schemas/instructor.schema';
import { UpdateInstructorDto } from '../dto/update-instructor.dto';
export declare class InstructorService {
    private instructorModel;
    constructor(instructorModel: Model<Instructor>);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateInstructorDto: UpdateInstructorDto): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateProfilePicture(id: string, url: string): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, Instructor> & Instructor & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getUserDetails(instructorId: string): Promise<any>;
}
