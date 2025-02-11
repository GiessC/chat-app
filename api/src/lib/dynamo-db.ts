import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class DynamoDb {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const dynamoDb = new DynamoDBClient();
    this.dynamoDbClient = DynamoDBDocumentClient.from(dynamoDb);
  }

  putItem<TItem>(request: PutItemRequest<TItem>): Promise<PutItemResponse> {
    return this.dynamoDbClient.send(
      new PutItemCommand(request as PutItemCommandInput),
    );
  }
}

type PutItemRequest<TItem> = Omit<PutItemCommandInput, 'Item'> & {
  Item: TItem;
};

type PutItemResponse = PutItemCommandOutput & {};

export class DynamoDbWrite<TEntity> {
  constructor(
    private readonly dynamoDb: DynamoDb,
    private readonly configService: ConfigService,
  ) {}

  public async save(entity: TEntity): Promise<TEntity> {
    const response = await this.dynamoDb.putItem<TEntity>({
      TableName: this.configService.get(
        'database.dynamoDb.dynamoDbMetadataTable',
      ),
      Item: entity,
      ReturnValues: 'ALL_NEW',
    });
    return response.Attributes as TEntity;
  }
}
