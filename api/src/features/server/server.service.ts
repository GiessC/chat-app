import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { ServerDynamoDbRepository } from './server.dynamo.repository';

@Injectable()
export class ServerService {
  constructor(private readonly repository: ServerDynamoDbRepository) {}

  public async create(createServerDto: CreateServerDto) {
    return await this.repository.create(createServerDto);
  }
}
