export default interface UpdateMemberDto {
  serverNickname: string;
  roleIds: string[];
  isBanned: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}
