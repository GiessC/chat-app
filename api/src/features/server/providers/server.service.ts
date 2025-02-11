import { Injectable } from '@nestjs/common';
import { ServerDynamoDbRepository } from './server.dynamo.repository';
import { Server } from '../entities/server.entity';

@Injectable()
export class ServerService {
  constructor(private readonly repository: ServerDynamoDbRepository) {}

  public async create(ownerId: string, name: string) {
    try {
      const server = new Server(ownerId, name);
      return await this.repository.create(server);
    } catch (error: unknown) {
      console.error(`Server service error caused by: ${String(error)}`);
      throw new ServerServiceError('Failed to create server.');
    }
  }
}

class ServerServiceError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ServerServiceError';
  }
}
