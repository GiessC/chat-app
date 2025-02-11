import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import ServerDynamoDbDto from '../dto/server.dynamo.dto';
import { Server } from '../entities/server.entity';

@Injectable()
export class ServerDynamoDbRepository {
  private readonly dynamoDb: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    this.dynamoDb = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: this.configService.get<string>('AWS_REGION'),
      }),
    );
  }

  public async create(server: Server): Promise<Server> {
    console.log('Creating server in DynamoDB:', server.serverId);
    const dto = new ServerDynamoDbDto(server);
    const response = await this.dynamoDb.send(
      new PutCommand({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Item: dto,
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ConditionExpression:
          'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
      }),
    );
    console.log(`Received response from DynamoDB:`, response);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      console.error(
        'DynamoDB: Server creation failed with HTTP status:',
        response.$metadata.httpStatusCode,
        '. Full response:',
        response,
      );
      throw new ServerRepositoryError('Server creation failed.');
    }
    return server;
  }
}

class ServerRepositoryError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ServerRepositoryError';
  }
}
