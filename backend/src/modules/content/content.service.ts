import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('Document') private documentModel: Model<any>
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  async getDocuments({
    search, 
    type, 
    priceRange, 
    sortBy, 
    instructorId
  }: {
    search?: string, 
    type?: string, 
    priceRange?: string, 
    sortBy?: string, 
    instructorId: string
  }) {
    const query: any = { instructorId: new Types.ObjectId(instructorId) };
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'all') {
      switch(priceRange) {
        case 'free':
          query.price = 0;
          break;
        case 'paid':
          query.price = { $gt: 0 };
          break;
        case 'under10':
          query.price = { $lt: 10 };
          break;
        case 'over10':
          query.price = { $gte: 10 };
          break;
      }
    }
    
    // Sorting
    const sort: any = {};
    switch(sortBy) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'priceAsc':
        sort.price = 1;
        break;
      case 'priceDesc':
        sort.price = -1;
        break;
      case 'downloads':
        sort.downloadCount = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    return this.documentModel.find(query).sort(sort);
  }

  async uploadDocument({
    file, 
    title, 
    type, 
    price, 
    instructorId, 
    tags
  }: {
    file: Express.Multer.File, 
    title: string, 
    type: string, 
    price: number, 
    instructorId: string,
    tags?: string[]
  }) {
    try {
      // Upload file to Cloudinary
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'documents',
            allowed_formats: ['pdf', 'doc', 'docx']
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      // Create document in MongoDB
      const document = new this.documentModel({
        title,
        type,
        price,
        instructorId: new Types.ObjectId(instructorId),
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        tags: tags || []
      });

      return await document.save();
    } catch (error) {
      throw new BadRequestException(`Document upload failed: ${error.message}`);
    }
  }

  async findDocumentById(documentId: string, userId: string) {
    // Validate document ID
    if (!Types.ObjectId.isValid(documentId)) {
      throw new BadRequestException('Invalid document ID');
    }

    // Find the document and ensure it belongs to the user
    const document = await this.documentModel.findOne({
      _id: new Types.ObjectId(documentId),
      instructorId: new Types.ObjectId(userId)
    });

    if (!document) {
      throw new NotFoundException('Document not found or access denied');
    }

    return document;
  }

  async checkPlagiarism(documentId: string) {
    try {
      const document = await this.documentModel.findById(documentId);
      if (!document) {
        throw new BadRequestException('Document not found');
      }

      // Placeholder for plagiarism check
      return {
        score: Math.random() * 10, // Random plagiarism score between 0-10
        results: []
      };
    } catch (error) {
      throw new BadRequestException(`Plagiarism check failed: ${error.message}`);
    }
  }

  async deleteDocument(id: string, instructorId: string) {
    try {
      const document = await this.documentModel.findOne({ 
        _id: id, 
        instructorId: new Types.ObjectId(instructorId) 
      });

      if (!document) {
        throw new BadRequestException('Document not found or unauthorized');
      }

      // Delete file from Cloudinary
      if (document.publicId) {
        await cloudinary.uploader.destroy(document.publicId, { resource_type: 'raw' });
      }

      // Delete document from MongoDB
      await document.deleteOne();
      return { message: 'Document deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Document deletion failed: ${error.message}`);
    }
  }
}
