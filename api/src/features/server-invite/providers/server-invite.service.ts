import { Injectable } from '@nestjs/common';
import ServerInvite from '../entities/server-invite.entity';
import { addDays } from 'date-fns';
import { ServerInviteDynamoDbRepository } from './server-invite.dynamo.repository';

@Injectable()
export default class ServerInviteService {
  constructor(private readonly repository: ServerInviteDynamoDbRepository) {}

  public async create(
    serverId: string,
    creatorId: string,
    expirationDays?: number,
    maxUses?: number,
  ) {
    try {
      const expirationDate = expirationDays
        ? addDays(new Date(), expirationDays)
        : undefined;
      const serverInvite = new ServerInvite(
        serverId,
        creatorId,
        expirationDate,
        maxUses,
      );
      return await this.repository.create(serverInvite);
    } catch (error: unknown) {
      console.error(`Server invite service error caused by: ${String(error)}`);
      throw new ServerInviteServiceError('Failed to create server invite.');
    }
  }

  async get(serverId: string, inviteId: string, token: string) {
    try {
      return await this.repository.get(serverId, inviteId, token);
    } catch (error: unknown) {
      console.error(`Server invite service error caused by: ${String(error)}`);
      throw new ServerInviteServiceError('Failed to get server invite.');
    }
  }

  async revoke(serverId: string, inviteId: string) {
    try {
      return await this.repository.revokeInvite(serverId, inviteId);
    } catch (error: unknown) {
      console.error(`Server invite service error caused by: ${String(error)}`);
      throw new ServerInviteServiceError('Failed to revoke server invite.');
    }
  }

  async list(serverId: string) {
    try {
      return await this.repository.list(serverId);
    } catch (error: unknown) {
      console.error(`Server invite service error caused by: ${String(error)}`);
      throw new ServerInviteServiceError('Failed to list server invites.');
    }
  }
}

export class ServerInviteServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerInviteServiceError';
  }
}
