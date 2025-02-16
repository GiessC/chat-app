import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDbModule } from '../../database/dynamo-db.module';
import ServerInviteService from './providers/server-invite.service';
import { ServerInviteDynamoRepository } from './providers/server-invite.dynamo.repository';
import { ServerInviteController } from './server-invite.controller';

@Module({
  imports: [ConfigModule, DynamoDbModule],
  controllers: [ServerInviteController],
  providers: [ServerInviteService, ServerInviteDynamoRepository],
})
export class ServerInviteModule {}
