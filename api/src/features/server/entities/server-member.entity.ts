import ServerMemberDynamoDto from '../dto/server-member.dynamo.dto';

export class ServerMember {
  private readonly _serverId: string;
  private readonly _userId: string;
  private readonly _username: string;
  private _serverNickname?: string;
  private _roleIds: string[];
  private _isBanned: boolean;
  private _isMuted: boolean;
  private _isDeafened: boolean;
  private readonly _joinedAt: Date;

  public static fromDynamoDbDto(dto: ServerMemberDynamoDto): ServerMember {
    return new ServerMember(
      dto.serverId,
      dto.userId,
      dto.username,
      dto.serverNickname,
      dto.roleIds,
      dto.isBanned,
      dto.isMuted,
      dto.isDeafened,
      new Date(dto.joinedAt),
    );
  }

  constructor(
    serverId: string,
    userId: string,
    username: string,
    serverNickname?: string,
    roleIds: string[] = [],
    isBanned: boolean = false,
    isMuted: boolean = false,
    isDeafened: boolean = false,
    joinedAt: Date = new Date(),
  ) {
    this._serverId = serverId;
    this._userId = userId;
    this._username = username;
    this._serverNickname = serverNickname;
    this._roleIds = roleIds;
    this._isBanned = isBanned;
    this._isMuted = isMuted;
    this._isDeafened = isDeafened;
    this._joinedAt = joinedAt;
  }

  public setServerNickname(serverNickname?: string) {
    this._serverNickname = serverNickname;
  }

  public setBanned(isBanned: boolean) {
    this._isBanned = isBanned;
  }

  public setMuted(isMuted: boolean) {
    this._isMuted = isMuted;
  }

  public setDeafened(isDeafened: boolean) {
    this._isDeafened = isDeafened;
  }

  public setRoles(roleIds: string[]) {
    this._roleIds = roleIds;
  }

  public get serverId(): string {
    return this._serverId;
  }

  public get userId(): string {
    return this._userId;
  }

  public get username(): string {
    return this._username;
  }

  public get serverNickname(): string | undefined {
    return this._serverNickname;
  }

  public get roleIds(): string[] {
    return this._roleIds;
  }

  public get isBanned(): boolean {
    return this._isBanned;
  }

  public get isMuted(): boolean {
    return this._isMuted;
  }

  public get isDeafened(): boolean {
    return this._isDeafened;
  }

  public get joinedAt(): Date {
    return this._joinedAt;
  }
}
