import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, callback) => {
    // Validate file
    if (!file) {
      return callback(new BadRequestException('No file uploaded'), false);
    }

    // Check file type
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Only PDF files are allowed'), false);
    }

    // Check file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return callback(new BadRequestException('File size exceeds 10MB limit'), false);
    }

    // Validate file buffer
    if (!file.buffer || file.buffer.length === 0) {
      return callback(new BadRequestException('Empty file'), false);
    }

    callback(null, true);
  }
};
