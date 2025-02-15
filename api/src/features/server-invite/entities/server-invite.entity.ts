export default class ServerInvite {
  constructor(
    private readonly _inviteId: string,
    private readonly _serverId: string,
    private readonly _creatorId: string,
    private readonly _expirationDate: Date,
    private readonly _maxUses: number,
    private readonly _uses: number,
  ) {}

  public static decodeLink(link: string) {
    const [inviteId, serverId] = Buffer.from(link, 'base64')
      .toString()
      .split(':');
    return {
      inviteId,
      serverId,
    };
  }

  public getInviteCode(): string {
    return Buffer.from(`${this._inviteId}:${this._serverId}`).toString(
      'base64',
    );
  }

  public isValid(): boolean {
    return !this.isExpired() && !this.isMaxUsesReached();
  }

  public isExpired(): boolean {
    return this._expirationDate < new Date();
  }

  public isMaxUsesReached(): boolean {
    return this._uses >= this._maxUses;
  }

  public get inviteId(): string {
    return this._inviteId;
  }

  public get expirationDate(): Date {
    return this._expirationDate;
  }

  public get maxUses(): number {
    return this._maxUses;
  }

  public get uses(): number {
    return this._uses;
  }

  public get creatorId(): string {
    return this._creatorId;
  }

  public get serverId(): string {
    return this._serverId;
  }
}
