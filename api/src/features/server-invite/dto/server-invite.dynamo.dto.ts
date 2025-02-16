import WithDynamoRetention from '../../../database/dynamo-db-retention';

export default class ServerInviteDynamoDto implements WithDynamoRetention {
  public readonly pk: string = ServerInviteDynamoDto.generatePk(this.inviteId);
  public readonly sk: string = ServerInviteDynamoDto.generateSk(this.serverId);
  public readonly retentionDateUnix?: number;
  public readonly expirationDate?: string;

  constructor(
    public readonly inviteId: string,
    public readonly serverId: string,
    public readonly creatorId: string,
    expirationDate?: Date,
    public readonly maxUses?: number,
    public readonly uses: number = 0,
    public readonly token?: string,
  ) {
    this.expirationDate = expirationDate?.toISOString();
    this.retentionDateUnix = expirationDate?.getTime();
  }

  private static generatePk(inviteId: string): string {
    return `INV#${inviteId}`;
  }

  private static generateSk(serverId: string): string {
    return `SERVER#${serverId}`;
  }
}
