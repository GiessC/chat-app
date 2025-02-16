import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
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

  async delete(request: DeleteRequest): Promise<void> {
    const response = await this.dynamoDb.send(new DeleteCommand(request));
    console.debug(`[DynamoDB] Delete response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] Delete failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
  }

  async update<TItem>(request: UpdateRequest<TItem>) {
    if (Object.keys(request.Updates).length === 0) {
      throw new DynamoDbError('[DynamoDB] No updates provided.');
    }
    const response = await this.dynamoDb.send(
      new UpdateCommand({
        ...request,
        ...this.getExpressionAttributes(request),
        ReturnValues: 'ALL_NEW',
      }),
    );
    console.debug(`[DynamoDB] Update response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] Update failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return response.Attributes as TItem;
  }

  private getExpressionAttributes<TItem>(
    request: UpdateRequest<TItem>,
  ): Pick<
    UpdateCommandInput,
    | 'ExpressionAttributeNames'
    | 'ExpressionAttributeValues'
    | 'UpdateExpression'
  > {
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};
    let updateExpression = 'SET ';

    Object.keys(request.Updates).forEach((key) => {
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = request.Updates[key];
      updateExpression += `#${key} = :${key}, `;
    });

    return {
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      UpdateExpression: updateExpression.slice(0, -2),
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

type DeleteRequest = DeleteCommandInput & {};

type UpdateRequest<TItem> = Omit<
  UpdateCommandInput,
  | 'AttributeValues'
  | 'ReturnValues'
  | 'ExpressionAttributeNames'
  | 'ExpressionAttributeValues'
  | 'UpdateExpression'
> & {
  Updates: Partial<TItem>;
};
