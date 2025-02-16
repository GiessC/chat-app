export default interface ServerInviteResponseDto {
  inviteCode: string;
  creatorId: string;
  expirationDate?: Date;
  maxUses?: number;
}
