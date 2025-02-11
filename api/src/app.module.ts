import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration, { configSchema } from './config/configuration';
import { ZodError } from 'zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function validate(config: Record<string, unknown>): Record<string, unknown> {
  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Configuration validation errors: ${error.issues.map((issue) => `${issue.path as unknown as string} - ${issue.message}`).join(', ')}`,
      );
    }
    throw error;
  }
}
