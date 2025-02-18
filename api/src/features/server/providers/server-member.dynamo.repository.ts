import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { ServerMember } from '../entities/server-member.entity';
import ServerMemberDynamoDto from '../dto/server-member.dynamo.dto';
import EntityAlreadyExistsError from '../../../common/errors/entity-already-exists.error';
import InternalError from '../../../common/errors/internal.error';
import BaseError from '../../../common/errors/base.error';
import { ErrorCode } from '../../../common/errors/error-code';

class EntityNotFoundException extends BaseError {
  constructor(message: string, cause?: Error, errorCode?: ErrorCode) {
    super(
      'EntityNotFoundException',
      message,
      errorCode ?? ErrorCode.ENTITY_NOT_FOUND,
      cause,
      HttpStatus.NOT_FOUND,
    );
  }
}

@Injectable()
export class ServerMemberDynamoDbRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  async create(serverMember: ServerMember): Promise<ServerMember> {
    try {
      const serverMemberDynamoDto =
        ServerMemberDynamoDto.fromMember(serverMember);
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
      return response.map((dto) => ServerMember.fromDynamoDbDto(dto));
    } catch (error: unknown) {
      console.error(error);
      throw new InternalError('Failed to get server members by user ID.');
    }
  }

  async getAllByServerId(serverId: string): Promise<ServerMember[]> {
    try {
      const response = await this.dynamoDb.query<ServerMemberDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': ServerMemberDynamoDto.generatePk(serverId),
          ':sk': ServerMemberDynamoDto.skFilterByServer(serverId),
        },
      });
      return response.map((dto) => ServerMember.fromDynamoDbDto(dto));
    } catch (error: unknown) {
      console.error(error);
      throw new InternalError('Failed to get server members by server ID.');
    }
  }

  async delete(serverId: string, userId: string) {
    try {
      await this.dynamoDb.delete({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Key: {
          pk: ServerMemberDynamoDto.generatePk(serverId),
          sk: ServerMemberDynamoDto.generateSk(serverId, userId),
        },
        ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)',
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof ConditionalCheckFailedException) {
        throw new EntityNotFoundException(
          'User is not a member of this server.',
          error,
        );
      }
      throw new InternalError('Failed to remove member from server.');
    }
  }

  async update(
    serverId: string,
    userId: string,
    updates: Partial<ServerMemberDynamoDto>,
  ): Promise<ServerMember> {
    try {
      const memberDto = await this.dynamoDb.update<ServerMemberDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Key: {
          pk: ServerMemberDynamoDto.generatePk(serverId),
          sk: ServerMemberDynamoDto.generateSk(serverId, userId),
        },
        Updates: updates,
      });
      return ServerMember.fromDynamoDbDto(memberDto);
    } catch (error: unknown) {
      console.error(error);
      throw new InternalError('Failed to update member.');
    }
  }
}
