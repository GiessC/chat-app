import { Module } from '@nestjs/common';
import { ServerService } from './providers/server.service';
import { ServerController } from './server.controller';
import { ConfigModule } from '@nestjs/config';
import { ServerDynamoDbRepository } from './providers/server.dynamo.repository';
import { DynamoDbModule } from '../../database/dynamo-db.module';

@Module({
  imports: [ConfigModule, DynamoDbModule],
  controllers: [ServerController],
  providers: [ServerService, ServerDynamoDbRepository],
})
export class ServerModule {}
