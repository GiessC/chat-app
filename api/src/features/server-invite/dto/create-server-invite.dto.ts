export default class CreateServerInviteDto {
  constructor(
    public readonly inviteId: string,
    public readonly serverId: string,
    public readonly creatorId: string,
    public readonly expirationDate: Date,
    public readonly maxUses: number,
    public readonly uses: number,
  ) {}
}
