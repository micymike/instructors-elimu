import { Response } from 'express';
import { ContentService } from './content.service';
import { JwtService } from '@nestjs/jwt';
export declare class ContentController {
    private readonly contentService;
    private readonly jwtService;
    constructor(contentService: ContentService, jwtService: JwtService);
    getDocuments(authHeader: string, search?: string, type?: string, priceRange?: string, sortBy?: string): Promise<any[]>;
    uploadDocument(userId: string, file: Express.Multer.File, title: string, type: string, price: number, tags?: string[]): Promise<any>;
    checkPlagiarism(documentId: string): Promise<{
        score: number;
        results: any[];
    }>;
    previewDocument(documentId: string, authHeader: string, res: Response): Promise<void>;
    downloadDocument(documentId: string, authHeader: string, res: Response): Promise<void>;
    deleteDocument(userId: string, id: string): Promise<{
        message: string;
    }>;
}
