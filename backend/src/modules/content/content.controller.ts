import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UploadedFile, 
  UseInterceptors, 
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { JwtService } from '@nestjs/jwt';
import { 
  UnauthorizedException, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import fetch from 'node-fetch';

@Controller('documents')
export class ContentController {
  constructor(private readonly contentService: ContentService, private readonly jwtService: JwtService) {}

  @Get()
  async getDocuments(
    @Headers('authorization') authHeader: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('priceRange') priceRange?: string,
    @Query('sortBy') sortBy?: string
  ) {
    // Extract user ID from the token
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Decode the token to get user ID
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      return this.contentService.getDocuments({
        search,
        type,
        priceRange,
        sortBy,
        instructorId: userId
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Headers('x-user-id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('type') type: string,
    @Body('price') price: number,
    @Body('tags') tags?: string[]
  ) {
    return this.contentService.uploadDocument({
      file,
      title,
      type,
      price,
      instructorId: userId,
      tags: tags || []
    });
  }

  @Post('check-plagiarism')
  async checkPlagiarism(
    @Body('documentId') documentId: string
  ) {
    return this.contentService.checkPlagiarism(documentId);
  }

  @Get(':id/preview')
  @HttpCode(HttpStatus.OK)
  async previewDocument(
    @Param('id') documentId: string,
    @Headers('authorization') authHeader: string,
    @Res() res: Response
  ) {
    try {
      // Extract token from Authorization header
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify the token
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      // Find the document
      const document = await this.contentService.findDocumentById(documentId, userId);

      // Stream the file from Cloudinary
      if (!document.cloudinaryUrl) {
        throw new NotFoundException('Document not found');
      }

      // Fetch the file from Cloudinary
      const response = await fetch(document.cloudinaryUrl);
      const fileBuffer = await response.buffer();

      // Set headers for PDF preview
      res.type('application/pdf');
      res.send(fileBuffer);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        res.status(HttpStatus.UNAUTHORIZED).json({ 
          statusCode: HttpStatus.UNAUTHORIZED, 
          message: error.message 
        });
      } else if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ 
          statusCode: HttpStatus.NOT_FOUND, 
          message: error.message 
        });
      } else {
        console.error('Document preview error:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR, 
          message: 'Failed to preview document' 
        });
      }
    }
  }

  @Get(':id/download')
  @HttpCode(HttpStatus.OK)
  async downloadDocument(
    @Param('id') documentId: string,
    @Headers('authorization') authHeader: string,
    @Res() res: Response
  ) {
    try {
      // Extract token from Authorization header
      const token = authHeader?.split(' ')[1];
      
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify the token
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      // Find the document
      const document = await this.contentService.findDocumentById(documentId, userId);

      // Stream the file from Cloudinary
      if (!document.cloudinaryUrl) {
        throw new NotFoundException('Document not found');
      }

      // Fetch the file from Cloudinary
      const response = await fetch(document.cloudinaryUrl);
      const fileBuffer = await response.buffer();

      // Set headers for PDF download
      res.type('application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);
      res.send(fileBuffer);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        res.status(HttpStatus.UNAUTHORIZED).json({ 
          statusCode: HttpStatus.UNAUTHORIZED, 
          message: error.message 
        });
      } else if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ 
          statusCode: HttpStatus.NOT_FOUND, 
          message: error.message 
        });
      } else {
        console.error('Document download error:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR, 
          message: 'Failed to download document' 
        });
      }
    }
  }

  @Delete(':id')
  async deleteDocument(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string
  ) {
    return this.contentService.deleteDocument(id, userId);
  }
}
