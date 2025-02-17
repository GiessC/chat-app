import WithDynamoRetention from '../../../database/dynamo-db-retention';
import { ServerInviteStatus } from '../entities/server-invite.entity';

export default class ServerInviteDynamoDto implements WithDynamoRetention {
  public readonly pk: string = ServerInviteDynamoDto.generatePk(this.serverId);
  public readonly sk: string = ServerInviteDynamoDto.generateSk(this.inviteId);
  public readonly retentionDateUnix?: number;
  public readonly expirationDate?: string;

  public static generatePk(serverId: string): string {
    return `SERVER#${serverId}`;
  }

  public static generateSk(inviteId: string): string {
    return `INV#${inviteId}`;
  }

  constructor(
    public readonly inviteId: string,
    public readonly serverId: string,
    public readonly creatorId: string,
    public readonly token: string,
    expirationDate?: Date,
    public readonly maxUses?: number,
    public readonly uses: number = 0,
    public readonly status: ServerInviteStatus = 'active',
  ) {
    this.expirationDate = expirationDate?.toISOString();
    this.retentionDateUnix = expirationDate?.getTime();
    this.status = status;
  }
}
