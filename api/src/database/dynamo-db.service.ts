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

  public async save<TItem>(
    request: SaveRequest<TItem>,
  ): Promise<SaveResponse<TItem>> {
    const response = await this.dynamoDb.send(new PutCommand(request));
    console.log(`[DynamoDB] Save response: ${JSON.stringify(response)}`);
    if (response.$metadata.httpStatusCode !== HttpStatus.OK) {
      throw new DynamoDbError(
        `[DynamoDB] Save failed with HTTP status: ${response.$metadata.httpStatusCode}. Full response: ${JSON.stringify(response)}`,
      );
    }
    return request.Item;
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
