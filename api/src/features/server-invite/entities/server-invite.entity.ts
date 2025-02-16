import { v4 as uuidv4 } from 'uuid';

export default class ServerInvite {
  private readonly _inviteId: string;
  private readonly _token: string;

  public static decodeInviteCode(inviteCode: string) {
    const [base64, token] = inviteCode.split(/(?<=.{6})/);
    const [inviteId, serverId] = Buffer.from(base64, 'base64')
      .toString()
      .split(':');
    return {
      inviteId,
      serverId,
      token,
    };
  }

  private static generateToken() {
    return uuidv4().replace(/-/g, '').substring(0, 6);
  }

  constructor(
    private readonly _serverId: string,
    private readonly _creatorId: string,
    private readonly _expirationDate?: Date,
    private readonly _maxUses?: number,
    private readonly _uses: number = 0,
    inviteId?: string,
    token?: string,
  ) {
    this._inviteId = inviteId ?? uuidv4();
    this._token = token ?? ServerInvite.generateToken();
  }

  public matchesToken(token: string): boolean {
    return this._token === token;
  }

  public getInviteCode(): string {
    return (
      Buffer.from(`${this._inviteId}:${this._serverId}`).toString('base64') +
      this._token
    );
  }

  public isValid(): boolean {
    return !this.isExpired() && !this.isMaxUsesReached();
  }

  public isExpired(): boolean {
    return !this._expirationDate || this._expirationDate < new Date();
  }

  public isMaxUsesReached(): boolean {
    if (!this._maxUses) {
      return false;
    }
    return this._uses >= this._maxUses;
  }

  public get token(): string {
    return this._token;
  }

  public get inviteId(): string {
    return this._inviteId;
  }

  public get expirationDate(): Date | undefined {
    return this._expirationDate;
  }

  public get maxUses(): number | undefined {
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
