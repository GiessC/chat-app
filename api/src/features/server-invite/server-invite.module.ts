import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDbModule } from '../../database/dynamo-db.module';
import ServerInviteService from './providers/server-invite.service';
import { ServerInviteController } from './server-invite.controller';
import { ServerInviteDynamoDbRepository } from './providers/server-invite.dynamo.repository';

@Module({
  imports: [ConfigModule, DynamoDbModule],
  controllers: [ServerInviteController],
  providers: [ServerInviteService, ServerInviteDynamoDbRepository],
  exports: [ServerInviteService],
})
export class ServerInviteModule {}
