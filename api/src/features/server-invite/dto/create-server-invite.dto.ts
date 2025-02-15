export default class CreateServerInviteDto {
  constructor(
    public readonly serverId: string,
    public readonly creatorId: string,
    public readonly expirationDate?: Date,
    public readonly maxUses?: number,
  ) {}
}
