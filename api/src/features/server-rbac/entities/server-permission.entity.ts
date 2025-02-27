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

  public allows(targetPermission: string): boolean {
    const parts = new Permission(this.permission);
    return parts.allows(new Permission(targetPermission));
  }
}

class Permission {
  private readonly app_scope: string; // * or server/{serverId}
  private readonly resource: string; // * or channel/{channelId}
  private readonly action: string; // * or {actionId}

  constructor(permission: string) {
    const parts = permission.split(':');
    this.app_scope = parts[0];
    this.resource = parts[1];
    this.action = parts[2];
  }

  public allows(otherPermission: Permission) {
    return (
      this.allowsAppScope(otherPermission.app_scope) &&
      this.allowsResource(otherPermission.resource) &&
      this.allowsAction(otherPermission.action)
    );
  }

  private allowsAppScope(app_scope: string) {
    return this.app_scope === '*' || this.app_scope === app_scope;
  }

  private allowsResource(resource: string) {
    return this.resource === '*' || this.resource === resource;
  }

  private allowsAction(action: string) {
    return this.action === '*' || this.action === action;
  }
}
