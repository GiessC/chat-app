import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  PutItemInput,
} from '@aws-sdk/client-dynamodb';

export default class DynamoDb {
  private readonly dynamoDb: DynamoDBDocumentClient;

  constructor() {
    const dynamoDbClient = new DynamoDBClient();
    this.dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
  }

  putItem(request: PutItemInput): Promise<PutItemResponse> {
    return this.dynamoDb.send(new PutItemCommand(request));
  }
}

type PutItemResponse = PutItemCommandOutput & {};
