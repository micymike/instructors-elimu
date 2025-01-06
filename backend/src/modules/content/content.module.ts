import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Document, DocumentSchema } from './schemas/document.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]),
    CloudinaryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService]
})
export class ContentModule {}
