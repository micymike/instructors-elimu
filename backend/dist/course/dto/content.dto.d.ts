export declare class CreateContentDto {
    video?: {
        originalname: string;
        buffer: Buffer;
        mimetype: string;
    };
    pdf?: {
        originalname: string;
        buffer: Buffer;
        mimetype: string;
    };
    title: string;
    description?: string;
    type: 'video' | 'document' | 'quiz' | 'assignment';
    duration?: number;
    transcoded?: boolean;
    originalUrl?: string;
    streamingUrl?: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    pdfUrl?: string;
    moduleIndex?: number;
    contentIndex?: number;
    isPublished?: boolean;
    category?: string;
    materials?: string[];
    metadata?: {
        lastUpdated?: Date;
        version?: number;
        downloadable?: boolean;
        estimatedDuration?: number;
    };
}
export declare class UpdateContentDto extends CreateContentDto {
}
