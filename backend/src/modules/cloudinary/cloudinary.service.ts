import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Multer } from 'multer';

interface CustomFileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File | CustomFileUpload, folder: string = 'course-files'): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer = file.buffer;
      const filename = file.originalname;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          filename
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }

  async uploadVideo(file: Express.Multer.File | CustomFileUpload, folder: string = 'course-videos'): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer = file.buffer;
      const filename = file.originalname;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'video',
          chunk_size: 6000000,
          filename
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Type guard method
  private isCustomFile(file: Express.Multer.File | CustomFileUpload): file is CustomFileUpload {
    return 'originalname' in file && 'buffer' in file && 'mimetype' in file;
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
