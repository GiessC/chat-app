import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import ServerInvite from '../entities/server-invite.entity';
import ServerInviteDynamoDto from '../dto/server-invite.dynamo.dto';

@Injectable()
export class ServerInviteDynamoRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  public async create(invite: ServerInvite): Promise<ServerInvite> {
    try {
      console.log('Creating server invite in DynamoDB:', invite.serverId);
      const dto = new ServerInviteDynamoDto(
        invite.inviteId,
        invite.serverId,
        invite.creatorId,
        invite.expirationDate,
        invite.maxUses,
        invite.uses,
        invite.token,
      );
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
}

export class ServerInviteDynamoDbRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerInviteDynamoDbRepositoryError';
  }
}
