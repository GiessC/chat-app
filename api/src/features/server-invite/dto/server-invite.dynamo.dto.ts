import WithDynamoRetention from '../../../database/dynamo-db-retention';
import ServerInvite, {
  ServerInviteStatus,
} from '../entities/server-invite.entity';
import { parseJSON } from 'date-fns';

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

  public toServerInvite(): ServerInvite {
    return new ServerInvite(
      this.serverId,
      this.creatorId,
      this.expirationDate ? parseJSON(this.expirationDate) : undefined,
      this.maxUses,
      this.uses,
      this.status,
      this.inviteId,
      this.token,
    );
  }
}
