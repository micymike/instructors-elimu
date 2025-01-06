import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AIModule } from './ai/ai.module';
import { CourseModule } from './course/course.module';
import { CourseGenerationModule } from './modules/course-generation.module';
import { GeminiService } from './services/gemini.service';
import { NotificationModule } from './notification/notification.module';
import { ZoomModule } from './zoom/zoom.module';
import { SettingsModule } from './modules/settings.module';
import { ContentModule } from './modules/content/content.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AIModule,
    CourseModule,
    CourseGenerationModule,
    NotificationModule,
    ZoomModule,
    SettingsModule,
    ContentModule,
    AuthModule,
  ],
  providers: [GeminiService],
})
export class AppModule {}
