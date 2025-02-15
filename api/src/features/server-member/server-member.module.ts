import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDbModule } from '../../database/dynamo-db.module';
import { ServerMemberDynamoDbRepository } from './providers/server-member.dynamo.repository';
import { ServerMemberController } from './server-member.controller';

@Module({
  imports: [ConfigModule, DynamoDbModule],
  controllers: [ServerMemberController],
  providers: [ServerMemberDynamoDbRepository],
})
export class ServerMemberModule {}
