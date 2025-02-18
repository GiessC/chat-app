import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import ServerInvite from '../entities/server-invite.entity';
import ServerInviteDynamoDto from '../dto/server-invite.dynamo.dto';

@Injectable()
export class ServerInviteDynamoDbRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  public async get(serverId: string, inviteId: string, token: string) {
    try {
      const request = {
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Key: {
          pk: ServerInviteDynamoDto.generatePk(inviteId),
          sk: ServerInviteDynamoDto.generateSk(serverId),
        },
      };
      const inviteDto = await this.dynamoDb.get<ServerInviteDynamoDto>(request);
      if (inviteDto.token !== token) {
        throw new ServerInviteDynamoDbRepositoryError('Invalid invite token');
      }
      return inviteDto.toServerInvite();
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof ConditionalCheckFailedException) {
        throw new ServerInviteDynamoDbRepositoryError(
          'Server invite already exists',
        );
      }
      throw error;
    }
  }

  public async create(invite: ServerInvite): Promise<ServerInvite> {
    try {
      console.log('Creating server invite in DynamoDB:', invite.serverId);
      const dto = invite.toDynamoDbDto();
      await this.dynamoDb.save<ServerInviteDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Item: dto,
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ConditionExpression:
          'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
      });
      return invite;
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof ConditionalCheckFailedException) {
        throw new ServerInviteDynamoDbRepositoryError(
          'Server invite already exists',
        );
      }
      throw new ServerInviteDynamoDbRepositoryError(
        'Failed to create server invite',
      );
    }
  }

  public async revokeInvite(serverId: string, inviteId: string) {
    try {
      await this.dynamoDb.delete({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Key: {
          pk: ServerInviteDynamoDto.generatePk(inviteId),
          sk: ServerInviteDynamoDto.generateSk(serverId),
        },
        ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)',
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof ConditionalCheckFailedException) {
        throw new ServerInviteDynamoDbRepositoryError('Invite not found');
      }
      throw new ServerInviteDynamoDbRepositoryError('Failed to revoke invite');
    }
  }

  async list(serverId: string): Promise<ServerInvite[]> {
    try {
      const invites = await this.dynamoDb.query<ServerInviteDynamoDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
          ':pk': ServerInviteDynamoDto.generatePk(serverId),
          ':sk': 'INV',
        },
      });
      return invites.map((inviteDto) => inviteDto.toServerInvite());
    } catch (error: unknown) {
      console.error(error);
      throw new ServerInviteDynamoDbRepositoryError('Failed to list invites');
    }
  }
}

export class ServerInviteDynamoDbRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerInviteDynamoDbRepositoryError';
  }
}
