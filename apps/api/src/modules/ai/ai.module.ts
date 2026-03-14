import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('AI_API_URL'),
        timeout: parseInt(config.get<string>('AI_TIMEOUT_MS') || '30000'),
        headers: {
          Authorization: `Bearer ${config.get<string>('AI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
