import { Injectable } from '@nestjs/common';
import { ServerDynamoDbRepository } from './server.dynamo.repository';
import { Server } from './entities/server.entity';

@Injectable()
export class ServerService {
  constructor(private readonly repository: ServerDynamoDbRepository) {}

  public async create(ownerId: string, name: string) {
    const server = new Server(ownerId, name);
    return await this.repository.create(server);
  }
}
