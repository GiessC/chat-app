interface WithDynamoRetention {
  readonly retentionDateUnix?: number;
}

export default class ServerInviteDynamoDto implements WithDynamoRetention {
  public readonly pk: string = this.generatePk();
  public readonly sk: string = this.generateSk();
  public readonly retentionDateUnix: number;

  constructor(
    public readonly inviteId: string,
    public readonly serverId: string,
    public readonly creatorId: string,
    public readonly expirationDate: Date,
    public readonly maxUses: number,
    public readonly uses: number,
  ) {}

  private generatePk(): string {
    return `INV#${this.inviteId}`;
  }

  private generateSk(): string {
    return `SERVER#${this.serverId}`;
  }
}
