export default class CreateServerInviteDto {
  constructor(
    public readonly serverId: string,
    public readonly creatorId: string,
    public readonly expirationDays?: number,
    public readonly maxUses?: number,
  ) {}
}
