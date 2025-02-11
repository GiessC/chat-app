import { HttpStatus, Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
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

  public async save<TItem extends Record<string, unknown>>(
    request: SaveRequest<TItem>,
  ): Promise<SaveResponse<TItem>> {
    const response = await this.dynamoDb.send(
      new PutCommand({
        ...request,
        ReturnValues: 'ALL_NEW',
      }),
    );
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `DynamoDB: Save failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return response.Attributes as TItem;
  }
}

type SaveRequest<TItem extends Record<string, unknown>> = PutCommandInput & {
  Item: TItem;
};

type SaveResponse<TItem extends Record<string, unknown>> = TItem;

class DynamoDbError extends Error {
  constructor(message: string) {
    super(message);
  }
}
