import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';

@Injectable()
export class ServerService {
  create(createServerDto: CreateServerDto) {
    return 'This action adds a new server';
  }
}
