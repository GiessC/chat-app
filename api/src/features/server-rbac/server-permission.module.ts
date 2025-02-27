import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDbModule } from '../../database/dynamo-db.module';
import ServerPermissionService from './providers/server-permission.service';
import { ServerPermissionDynamoDbRepository } from './providers/server-permission.dynamo.repository';

@Module({
  imports: [ConfigModule, DynamoDbModule],
  providers: [ServerPermissionService, ServerPermissionDynamoDbRepository],
  exports: [ServerPermissionService],
})
export class ServerPermissionModule {}
