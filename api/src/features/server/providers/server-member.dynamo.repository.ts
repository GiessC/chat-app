import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { ServerMember } from '../entities/server-member.entity';
import ServerMemberDynamoDto from '../dto/server-member.dynamo.dto';
import EntityAlreadyExistsError from '../../../common/errors/entity-already-exists.error';
import InternalError from '../../../common/errors/internal.error';

@Injectable()
export class ServerMemberDynamoDbRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  async create(serverMember: ServerMember): Promise<ServerMember> {
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
        throw new EntityAlreadyExistsError(
          'You have already joined this server.',
          e,
        );
      }
      throw new InternalError('Failed to join server.');
    }
  }

  async getAllByUserId(userId: string): Promise<ServerMember[]> {
    try {
      const response = await this.dynamoDb.query<ServerMemberDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        IndexName: 'gsi1pk-gsi1sk-index',
        KeyConditionExpression: 'gsi1pk = :gsi1pk AND gsi1sk = :gsi1sk',
        ExpressionAttributeValues: {
          ':gsi1pk': ServerMemberDynamoDto.generateGsi1Pk(userId),
          ':gsi1sk': ServerMemberDynamoDto.generateGsi1Sk(),
        },
      });
      return response.map(
        (item) =>
          new ServerMember(
            item.serverId,
            item.userId,
            item.username,
            item.serverNickname,
            item.roleIds,
            item.isBanned,
            item.isMuted,
            item.isDeafened,
          ),
      );
    } catch (error: unknown) {
      console.error(error);
      throw new InternalError('Failed to get server members by user ID.');
    }
  }

  async getAllByServerId(serverId: string): Promise<ServerMember[]> {
    try {
      const response = await this.dynamoDb.query<ServerMemberDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        KeyConditionExpression: 'pk = :pk AND sk = :sk',
        ExpressionAttributeValues: {
          ':pk': ServerMemberDynamoDto.pkFilterByServer(serverId),
          ':sk': ServerMemberDynamoDto.generateSk(serverId),
        },
      });
      return response.map(
        (item) =>
          new ServerMember(
            item.serverId,
            item.userId,
            item.username,
            item.serverNickname,
            item.roleIds,
            item.isBanned,
            item.isMuted,
            item.isDeafened,
          ),
      );
    } catch (error: unknown) {
      console.error(error);
      throw new InternalError('Failed to get server members by server ID.');
    }
  }
}
