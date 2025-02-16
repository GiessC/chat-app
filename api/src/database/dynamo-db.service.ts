import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class DynamoDbService {
  private readonly dynamoDb: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    this.dynamoDb = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: this.configService.get<string>('AWS_REGION'),
      }),
    );
  }

  public async save<TItem>(
    request: SaveRequest<TItem>,
  ): Promise<SaveResponse<TItem>> {
    const response = await this.dynamoDb.send(new PutCommand(request));
    console.debug(`[DynamoDB] Save response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] Save failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return request.Item;
  }

  async get<TItem>(request: GetRequest): Promise<TItem> {
    const response = await this.dynamoDb.send(new GetCommand(request));
    console.debug(`[DynamoDB] Get response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] Get failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return response.Item as TItem;
  }

  async query<TItem>(request: QueryRequest): Promise<TItem[]> {
    const response = await this.dynamoDb.send(new QueryCommand(request));
    console.debug(`[DynamoDB] Query response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] Query failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return response.Items as TItem[];
  }

  async batchGet<TItem>(request: BatchGetCommandInput) {
    const response = await this.dynamoDb.send(new BatchGetCommand(request));
    console.debug(`[DynamoDB] BatchGet response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] BatchGet failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return response.Responses as {
      [key: string]: TItem[];
    };
  }
}

type SaveRequest<TItem> = PutCommandInput & {
  Item: TItem;
};

type SaveResponse<TItem> = TItem;

class DynamoDbError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type GetRequest = GetCommandInput & {};

type QueryRequest = QueryCommandInput & {};
