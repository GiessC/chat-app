import { Injectable } from '@nestjs/common';
import { ServerInviteDynamoRepository } from './server-invite.dynamo.repository';
import ServerInvite from '../entities/server-invite.entity';
import CreateServerInviteDto from '../dto/create-server-invite.dto';

@Injectable()
export default class ServerInviteService {
  constructor(private readonly repository: ServerInviteDynamoRepository) {}

  // TODO: Validate creator has permissions to create server invites in the server
  public async create(createServerInviteDto: CreateServerInviteDto) {
    try {
      const serverInvite = new ServerInvite(
        createServerInviteDto.serverId,
        createServerInviteDto.creatorId,
        createServerInviteDto.expirationDate,
        createServerInviteDto.maxUses,
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
