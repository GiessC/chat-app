import { Injectable } from '@nestjs/common';
import { ServerDynamoDbRepository } from './server.dynamo.repository';
import { Server } from '../entities/server.entity';
import { ServerMemberDynamoDbRepository } from './server-member.dynamo.repository';
import { ServerMember } from '../entities/server-member.entity';

@Injectable()
export class ServerService {
  constructor(
    private readonly serverRepo: ServerDynamoDbRepository,
    private readonly serverMemberRepo: ServerMemberDynamoDbRepository,
  ) {}

  public async create(ownerId: string, name: string) {
    try {
      const server = new Server(ownerId, name);
      return await this.serverRepo.create(server);
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to create server.');
    }
  }

  async join(
    serverId: string,
    userId: string,
    username: string,
  ): Promise<Server> {
    try {
      const serverMember = new ServerMember(serverId, userId, username);
      await this.serverMemberRepo.create(serverMember);
      return await this.serverRepo.get(serverId);
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to join server.');
    }
  }
}

class ServerServiceError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ServerServiceError';
  }
}
