import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { ServerMember } from '../entities/server-member.entity';
import ServerMemberDynamoDto from '../dto/server-member.dynamo.dto';

@Injectable()
export class ServerMemberDynamoDbRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  async joinServer(serverMember: ServerMember): Promise<ServerMember> {
    try {
      const serverMemberDynamoDto = new ServerMemberDynamoDto(
        serverMember.serverId,
        serverMember.userId,
        serverMember.username,
        serverMember.serverNickname,
        serverMember.roleIds,
        serverMember.isBanned,
        serverMember.isMuted,
        serverMember.isDeafened,
      );
      await this.dynamoDb.save<ServerMemberDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Item: serverMemberDynamoDto,
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ConditionExpression:
          'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
      });
      return serverMember;
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        throw new ServerMemberDynamoDbRepositoryError(
          'You have already joined this server.',
        );
      }
      throw new ServerMemberDynamoDbRepositoryError('Failed to join server.');
    }
  }
}

export class ServerMemberDynamoDbRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerMemberDynamoDbRepositoryError';
  }
}
