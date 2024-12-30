import { ConfigService } from '@nestjs/config';
interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class UploadService {
    private configService;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    uploadFile(file: UploadedFile): Promise<{
        url: string;
    }>;
    deleteFile(fileName: string): Promise<void>;
}
export {};
