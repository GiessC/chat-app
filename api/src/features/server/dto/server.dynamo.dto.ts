import { Server } from '../entities/server.entity';

export default class ServerDynamoDbDto {
  readonly pk: string;
  readonly sk: string;
  readonly serverId: string;
  readonly ownerId: string;
  readonly name: string;
  readonly createdAt: string;

  constructor(
    serverId: string,
    ownerId: string,
    name: string,
    createdAt: string,
  ) {
    this.pk = ServerDynamoDbDto.generatePk(serverId);
    this.sk = ServerDynamoDbDto.generateSk(serverId);
    this.serverId = serverId;
    this.ownerId = ownerId;
    this.name = name;
    this.createdAt = createdAt;
  }

  public static generatePk(serverId: string) {
    return `SERVER#${serverId}`;
  }

  public static generateSk(serverId: string) {
    return `SERVER#${serverId}`;
  }

  public toServer(): Server {
    return new Server(this.ownerId, this.name, this.serverId, this.createdAt);
  }
}
