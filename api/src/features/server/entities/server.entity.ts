import { v4 as uuidv4 } from 'uuid';
import ServerDynamoDbDto from '../dto/server.dynamo.dto';

export class Server {
  private readonly _serverId: string;
  private readonly _ownerId: string;
  private readonly _name: string;
  private readonly _createdAt: string;

  constructor(
    ownerId: string,
    name: string,
    serverId?: string,
    createdAt?: string,
  ) {
    this._serverId = serverId ?? uuidv4();
    this._ownerId = ownerId;
    this._name = name;
    this._createdAt = createdAt ?? new Date().toISOString();
  }

  get serverId(): string {
    return this._serverId;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  public toDynamoDbDto(): ServerDynamoDbDto {
    return new ServerDynamoDbDto(
      this._serverId,
      this._ownerId,
      this._name,
      this._createdAt,
    );
  }
}
