import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '../notification/notification.module'; 
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';

@Module({
  imports: [ConfigModule, NotificationModule], 
  controllers: [ZoomController],
  providers: [ZoomService],
  exports: [ZoomService, NotificationModule], // Add NotificationModule here
})
export class ZoomModule {}
