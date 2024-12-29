import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AIModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { CourseGenerationModule } from './modules/course-generation/course-generation.module';
import { CourseGenerationController } from './controllers/course-generation.controller';
import { GeminiService } from './services/gemini.service';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    AIModule,
    AuthModule,
    CourseModule,
    CourseGenerationModule,
  ],
  controllers: [CourseGenerationController],
  providers: [GeminiService],
})
export class AppModule {}
