export default class ServerMemberDynamoDto {
  public readonly pk: string;
  public readonly sk: string;
  public readonly gsi1Pk: string;
  public readonly gsi1Sk: string;
  private readonly _serverId: string;
  private readonly _userId: string;
  private readonly _username: string;
  private _serverNickname?: string;
  private _roleIds: string[];
  private _isBanned: boolean;
  private _isMuted: boolean;
  private _isDeafened: boolean;

  constructor(
    serverId: string,
    userId: string,
    username: string,
    serverNickname?: string,
    roleIds: string[] = [],
    isBanned: boolean = false,
    isMuted: boolean = false,
    isDeafened: boolean = false,
  ) {
    this._serverId = serverId;
    this._userId = userId;
    this._username = username;
    this._serverNickname = serverNickname;
    this._roleIds = roleIds;
    this._isBanned = isBanned;
    this._isMuted = isMuted;
    this._isDeafened = isDeafened;
    this.pk = ServerMemberDynamoDto.generatePk(this._serverId, this._userId);
    this.sk = ServerMemberDynamoDto.generateSk(this._serverId);
    this.gsi1Pk = ServerMemberDynamoDto.generateGsi1Pk(this._userId);
    this.gsi1Sk = ServerMemberDynamoDto.generateGsi1Sk();
  }

  public static generatePk(serverId: string, userId: string) {
    return `SERVER#${serverId}#MEMBER#${userId}`;
  }

  public static generateSk(serverId: string) {
    return `SERVER#${serverId}#MEMBER`;
  }

  public static generateGsi1Pk(userId: string) {
    return `SERVER_MEMBER#${userId}`;
  }

  public static generateGsi1Sk() {
    return '';
  }
}
