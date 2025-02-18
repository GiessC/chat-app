import { ServerMember } from '../entities/server-member.entity';

export default class ServerMemberDynamoDto {
  public readonly pk: string;
  public readonly sk: string;
  public readonly gsi1pk: string;
  public readonly gsi1sk: string;
  public readonly serverId: string;
  public readonly userId: string;
  public readonly username: string;
  public readonly serverNickname?: string;
  public readonly roleIds: string[];
  public readonly joinedAt: string;
  public readonly isBanned: boolean;
  public readonly isMuted: boolean;
  public readonly isDeafened: boolean;

  constructor(
    serverId: string,
    userId: string,
    username: string,
    serverNickname?: string,
    roleIds: string[] = [],
    joinedAt: Date = new Date(),
    isBanned: boolean = false,
    isMuted: boolean = false,
    isDeafened: boolean = false,
  ) {
    this.serverId = serverId;
    this.userId = userId;
    this.username = username;
    this.serverNickname = serverNickname;
    this.roleIds = roleIds;
    this.joinedAt = joinedAt.toISOString();
    this.isBanned = isBanned;
    this.isMuted = isMuted;
    this.isDeafened = isDeafened;
    this.pk = ServerMemberDynamoDto.generatePk(this.serverId);
    this.sk = ServerMemberDynamoDto.generateSk(this.serverId, this.userId);
    this.gsi1pk = ServerMemberDynamoDto.generateGsi1Pk(this.userId);
    this.gsi1sk = ServerMemberDynamoDto.generateGsi1Sk();
  }

  public static generatePk(serverId: string) {
    return `SERVER#${serverId}#MEMBER`;
  }

  public static generateSk(serverId: string, userId: string) {
    return `SERVER#${serverId}#MEMBER#${userId}`;
  }

  public static skFilterByServer(serverId: string) {
    return `SERVER#${serverId}#MEMBER`;
  }

  public static generateGsi1Pk(userId: string) {
    return `SERVER_MEMBER#${userId}`;
  }

  public static generateGsi1Sk() {
    return '$';
  }

  public toServerMember(): ServerMember {
    return new ServerMember(
      this.serverId,
      this.userId,
      this.username,
      this.serverNickname,
      this.roleIds,
      this.isBanned,
      this.isMuted,
      this.isDeafened,
      new Date(this.joinedAt),
    );
  }
}
