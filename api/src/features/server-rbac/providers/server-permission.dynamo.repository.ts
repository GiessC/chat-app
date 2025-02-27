import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DynamoDbService from '../../../database/dynamo-db.service';
import ServerPermissionDynamoDbDto from '../dto/server-permission.dynamo.dto';
import ServerPermission from '../entities/server-permission.entity';

@Injectable()
export class ServerPermissionDynamoDbRepository {
  constructor(
    private readonly dynamoDb: DynamoDbService,
    private readonly configService: ConfigService,
  ) {}

  public async getUserPermissions(
    serverId: string,
    userId: string,
    roleIds: string[],
    permission: string,
  ): Promise<ServerPermission[]> {
    const userIdentities: string[] = [userId, ...roleIds];
    const {
      keyCondition,
      expressionAttributeValues,
      expressionAttributeNames,
    } = this.dynamoDb.one_of_filter('sk', userIdentities);

    const response = await this.dynamoDb.query<ServerPermissionDynamoDbDto>({
      TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
      KeyConditionExpression: `pk = :pk and (${keyCondition})`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
      },
      ExpressionAttributeValues: {
        ':pk': ServerPermissionDynamoDbDto.generatePk(serverId, permission),
        ...expressionAttributeValues,
      },
    });

    return response.map((dto) => dto.toServerPermission());
  }
}
