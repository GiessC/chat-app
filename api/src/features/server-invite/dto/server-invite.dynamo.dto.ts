import WithDynamoRetention from '../../../database/dynamo-db-retention';
import { ServerInviteStatus } from '../entities/server-invite.entity';

export default class ServerInviteDynamoDto implements WithDynamoRetention {
  public readonly pk: string = ServerInviteDynamoDto.generatePk(
    this.inviteId,
    this.token,
  );
  public readonly sk: string = ServerInviteDynamoDto.generateSk(this.serverId);
  public readonly retentionDateUnix?: number;
  public readonly expirationDate?: string;

  public static generatePk(inviteId: string, token: string): string {
    return `INV#${inviteId}#${token}`;
  }

  public static generateSk(serverId: string): string {
    return `SERVER#${serverId}`;
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
