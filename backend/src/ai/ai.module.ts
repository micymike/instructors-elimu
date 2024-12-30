import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';
import { AIService } from './ai.service';

@Module({
  imports: [ConfigModule],
  providers: [GeminiService, AIService],
  exports: [GeminiService, AIService],
})
export class AIModule {}
