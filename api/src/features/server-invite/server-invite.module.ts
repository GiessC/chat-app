import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDbModule } from '../../database/dynamo-db.module';
import ServerInviteService from './providers/server-invite.service';
import { ServerInviteDynamoDbRepository } from './providers/server-invite-dynamo-db-repository.service';
import { ServerInviteController } from './server-invite.controller';

@Module({
  imports: [ConfigModule, DynamoDbModule],
  controllers: [ServerInviteController],
  providers: [ServerInviteService, ServerInviteDynamoDbRepository],
})
export class ServerInviteModule {}
