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
}
