import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CourseGenerationController } from '../../controllers/course-generation.controller';
import { CourseGenerationService } from './course-generation.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { AIModule } from '../../ai/ai.module';
import { AIService } from '../../ai/ai.service';
import { GeminiService } from '../../services/gemini.service';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        AIModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [CourseGenerationController],
    providers: [CourseGenerationService, AIService, GeminiService],
    exports: [CourseGenerationService],
})
export class CourseGenerationModule { }