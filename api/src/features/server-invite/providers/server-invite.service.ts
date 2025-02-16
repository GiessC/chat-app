import { Injectable } from '@nestjs/common';
import { ServerInviteDynamoDbRepository } from './server-invite-dynamo-db-repository.service';
import ServerInvite from '../entities/server-invite.entity';
import { addDays } from 'date-fns';

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
}

export class ServerInviteServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerInviteServiceError';
  }
}
