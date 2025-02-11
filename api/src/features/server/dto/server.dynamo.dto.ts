import { Server } from '../entities/server.entity';

export default class ServerDynamoDbDto {
  readonly pk: string;
  readonly sk: string;
  readonly serverId: string;
  readonly ownerId: string;
  readonly name: string;
  readonly createdAt: string;

  constructor(server: Server) {
    this.pk = ServerDynamoDbDto.generatePk(server.serverId);
    this.sk = ServerDynamoDbDto.generateSk(server.serverId);
    this.serverId = server.serverId;
    this.ownerId = server.ownerId;
    this.name = server.name;
    this.createdAt = server.createdAt;
  }

  public static generatePk(serverId: string) {
    return `SERVER#${serverId}`;
  }

  public static generateSk(serverId: string) {
    return `SERVER#${serverId}`;
  }
}
