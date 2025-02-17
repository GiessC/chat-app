import { Module } from '@nestjs/common';
import { ServerService } from './providers/server.service';
import { ServerController } from './server.controller';
import { ConfigModule } from '@nestjs/config';
import { ServerDynamoDbRepository } from './providers/server.dynamo.repository';
import { DynamoDbModule } from '../../database/dynamo-db.module';
import { ServerInviteModule } from '../server-invite/server-invite.module';
import { ServerMemberDynamoDbRepository } from './providers/server-member.dynamo.repository';

@Module({
  imports: [ConfigModule, DynamoDbModule, ServerInviteModule],
  controllers: [ServerController],
  providers: [
    ServerService,
    ServerDynamoDbRepository,
    ServerMemberDynamoDbRepository,
  ],
})
export class ServerModule {}
