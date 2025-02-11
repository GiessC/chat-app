import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { ConfigModule } from '@nestjs/config';
import { ServerDynamoDbRepository } from './server.dynamo.repository';

@Module({
  imports: [ConfigModule],
  controllers: [ServerController],
  providers: [ServerService, ServerDynamoDbRepository],
})
export class ServerModule {}
