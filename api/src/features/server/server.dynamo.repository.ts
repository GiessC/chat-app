import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import ServerDynamoDbDto from './dto/server.dynamo.dto';
import { Server } from './entities/server.entity';

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

  create(server: Server) {
    const dto = new ServerDynamoDbDto(server);
    return this.dynamoDb.send(
      new PutCommand({
        TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        Item: dto,
      }),
    );
  }
}
