import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSettings, UserSettingsSchema } from '../../schemas/user-settings.schema';
import { UserService } from '../../services/user.service';

import { GroupModule } from '../../instructor/group.module';
import { InstructorModule } from 'src/interceptors/instructor.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSettings.name, schema: UserSettingsSchema }]),
    InstructorModule,
  ],
  providers: [SettingsService, UserService],
  controllers: [SettingsController],
})
export class SettingsModule {}
