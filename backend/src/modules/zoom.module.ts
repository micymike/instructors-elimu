import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ZoomService } from '../services/zoom.service';
import { ZoomController } from '../controllers/zoom.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [ZoomController],
  providers: [ZoomService],
  exports: [ZoomService],
})
export class ZoomModule {} 