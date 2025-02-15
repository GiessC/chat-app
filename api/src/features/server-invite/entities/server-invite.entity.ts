export default class ServerInvite {
  constructor(
    private readonly inviteId: string,
    private readonly serverId: string,
    private readonly creatorId: string,
    private readonly expirationDate: Date,
    private readonly maxUses: number,
    private readonly uses: number,
  ) {}

  public static decodeLink(link: string): {
    inviteId: string;
    serverId: string;
  } {
    const [inviteId, serverId] = Buffer.from(link, 'base64')
      .toString()
      .split(':');
    return {
      inviteId,
      serverId,
    };
  }

  public getInviteCode(): string {
    return Buffer.from(`${this.inviteId}:${this.serverId}`).toString('base64');
  }

  public isValid(): boolean {
    return !this.isExpired() && !this.isMaxUsesReached();
  }

  public isExpired(): boolean {
    return this.expirationDate < new Date();
  }

  public isMaxUsesReached(): boolean {
    return this.uses >= this.maxUses;
  }

  public get creator(): string {
    return this.creatorId;
  }
}
