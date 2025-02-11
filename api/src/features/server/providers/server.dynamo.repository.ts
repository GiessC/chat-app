import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ServerDynamoDbDto from '../dto/server.dynamo.dto';
import { Server } from '../entities/server.entity';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

@Injectable()
export class ServerDynamoDbRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  public async create(server: Server): Promise<Server> {
    try {
      console.log('Creating server in DynamoDB:', server.serverId);
      const dto = new ServerDynamoDbDto(server);
      await this.dynamoDb.save<ServerDynamoDbDto>({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Item: dto,
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ConditionExpression:
          'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
      });
      return server;
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof ConditionalCheckFailedException) {
        throw new ServerDynamoDbRepositoryError('Server already exists');
      }
      throw new ServerDynamoDbRepositoryError('Failed to create server');
    }
  }
}

export class ServerDynamoDbRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerDynamoDbRepositoryError';
  }
}
