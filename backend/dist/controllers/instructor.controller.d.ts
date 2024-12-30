import { UploadedFile } from '@nestjs/common';
import { S3Service } from '../services/s3.service';
import { InstructorService } from '../services/instructor.service';
import { UpdateInstructorDto } from '../dto/update-instructor.dto';
interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class InstructorController {
    private readonly s3Service;
    private readonly instructorService;
    constructor(s3Service: S3Service, instructorService: InstructorService);
    uploadProfilePicture(file: UploadedFile, req: any): Promise<{
        url: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/instructor.schema").Instructor> & import("../schemas/instructor.schema").Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/instructor.schema").Instructor> & import("../schemas/instructor.schema").Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateInstructorDto: UpdateInstructorDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/instructor.schema").Instructor> & import("../schemas/instructor.schema").Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/instructor.schema").Instructor> & import("../schemas/instructor.schema").Instructor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getDashboardStats(req: any): Promise<import("../types/dashboard-stats.type").DashboardStats>;
}
export {};
