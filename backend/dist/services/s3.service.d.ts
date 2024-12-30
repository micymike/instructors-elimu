import { ConfigService } from '@nestjs/config';
interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class S3Service {
    private configService;
    private s3;
    constructor(configService: ConfigService);
    uploadProfilePicture(file: UploadedFile, instructorId: string): Promise<string>;
    deleteProfilePicture(url: string): Promise<void>;
}
export {};
