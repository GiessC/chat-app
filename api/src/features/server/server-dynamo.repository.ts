import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { DynamoDbWrite } from '../../lib/dynamo-db';
import ServerDynamoDbDto from './dto/server-dynamo.dto';
import { Server } from './entities/server.entity';

@Injectable()
export class ServerDynamoDbRepository extends DynamoDbWrite<ServerDynamoDbDto> {
  create(createServerDto: CreateServerDto) {
    const server = new Server(createServerDto.ownerId, createServerDto.name);
    return this.save(new ServerDynamoDbDto(server));
  }
}
