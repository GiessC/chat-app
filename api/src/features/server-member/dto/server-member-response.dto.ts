export default interface ServerMemberResponseDto {
  readonly serverId: string;
  readonly userId: string;
  readonly username: string;
  readonly serverNickname?: string;
  readonly roleIds: string[];
  readonly isBanned: boolean;
  readonly isMuted: boolean;
  readonly isDeafened: boolean;
}
