import ServerPermissionDynamoDbDto from '../dto/server-permission.dynamo.dto';

export default class ServerPermission {
  private readonly permission: string;
  private readonly serverId: string;
  private readonly channelIdOrWildcard: string;
  private readonly identityId: string;
  private readonly allowed: boolean;
  private readonly createdAt: string;

  constructor(
    permission: string,
    serverId: string,
    channelIdOrWildcard: string,
    identityId: string,
    allowed: boolean,
    createdAt: string = new Date().toISOString(),
  ) {
    this.permission = permission;
    this.serverId = serverId;
    this.channelIdOrWildcard = channelIdOrWildcard;
    this.identityId = identityId;
    this.allowed = allowed;
    this.createdAt = createdAt;
  }

  public toDynamoDbDto(): ServerPermissionDynamoDbDto {
    return new ServerPermissionDynamoDbDto(
      this.permission,
      this.serverId,
      this.channelIdOrWildcard,
      this.identityId,
      this.allowed,
      this.createdAt,
    );
  }
}
