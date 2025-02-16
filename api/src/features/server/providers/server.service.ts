import { Injectable } from '@nestjs/common';
import { ServerDynamoDbRepository } from './server.dynamo.repository';
import { Server } from '../entities/server.entity';
import { ServerMemberDynamoDbRepository } from './server-member.dynamo.repository';
import { ServerMember } from '../entities/server-member.entity';
import UpdateMemberDto from '../dto/update-member.dto';

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

  async getServersByUser(userId: string): Promise<Server[]> {
    try {
      const serverMembers = await this.serverMemberRepo.getAllByUserId(userId);
      if (serverMembers.length === 0) {
        return [];
      }
      return this.serverRepo.getMany(serverMembers.map((m) => m.serverId));
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to get servers by user.');
    }
  }

  async getUsersByServer(serverId: string): Promise<ServerMember[]> {
    try {
      return await this.serverMemberRepo.getAllByServerId(serverId);
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to get servers by user.');
    }
  }

  async removeMember(serverId: string, userId: string) {
    try {
      await this.serverMemberRepo.delete(serverId, userId);
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to remove member from server.');
    }
  }

  async updateMember(
    serverId: string,
    userId: string,
    updateDto: UpdateMemberDto,
  ): Promise<ServerMember> {
    try {
      return await this.serverMemberRepo.update(serverId, userId, updateDto);
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to update member.');
    }
  }
}

class ServerServiceError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ServerServiceError';
  }
}
