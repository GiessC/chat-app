import ServerPermission from '../entities/server-permission.entity';

export default class ServerPermissionDynamoDbDto {
  public readonly pk: string;
  public readonly sk: string;
  public readonly permission: string;
  public readonly serverId: string;
  public readonly channelIdOrWildcard: string;
  public readonly identityId: string;
  public readonly allowed: boolean;
  public readonly createdAt: string;

  public static generatePk(serverId: string, identityId: string) {
    return `SERVER#${serverId}#IDENTITY#${identityId}`;
  }

  public static generateSk(channelIdOrWildcard: string, permission: string) {
    return `CHANNEL#${channelIdOrWildcard}#PERMISSION#${permission}`;
  }

  constructor(
    permission: string,
    serverId: string,
    channelIdOrWildcard: string,
    identityId: string,
    allowed: boolean,
    createdAt: string = new Date().toISOString(),
  ) {
    this.pk = ServerPermissionDynamoDbDto.generatePk(serverId, identityId);
    this.sk = ServerPermissionDynamoDbDto.generateSk(
      channelIdOrWildcard,
      permission,
    );
    this.permission = permission;
    this.serverId = serverId;
    this.channelIdOrWildcard = channelIdOrWildcard;
    this.identityId = identityId;
    this.allowed = allowed;
    this.createdAt = createdAt;
  }

  public toServerPermission(): ServerPermission {
    return new ServerPermission(
      this.permission,
      this.serverId,
      this.channelIdOrWildcard,
      this.identityId,
      this.allowed,
      this.createdAt,
    );
  }
}
