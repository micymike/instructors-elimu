import { Model } from 'mongoose';
export declare class ContentService {
    private documentModel;
    constructor(documentModel: Model<any>);
    getDocuments({ search, type, priceRange, sortBy, instructorId }: {
        search?: string;
        type?: string;
        priceRange?: string;
        sortBy?: string;
        instructorId: string;
    }): Promise<any[]>;
    uploadDocument({ file, title, type, price, instructorId, tags }: {
        file: Express.Multer.File;
        title: string;
        type: string;
        price: number;
        instructorId: string;
        tags?: string[];
    }): Promise<any>;
    findDocumentById(documentId: string, userId: string): Promise<any>;
    checkPlagiarism(documentId: string): Promise<{
        score: number;
        results: any[];
    }>;
    deleteDocument(id: string, instructorId: string): Promise<{
        message: string;
    }>;
}
