import { ConfigService } from '@nestjs/config';
interface CustomFileUpload {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
}
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File | CustomFileUpload, folder?: string): Promise<string>;
    uploadVideo(file: Express.Multer.File | CustomFileUpload, folder?: string): Promise<string>;
    private isCustomFile;
    deleteFile(publicId: string): Promise<void>;
}
export {};
