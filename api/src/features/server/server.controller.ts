import { Controller, Post, Body } from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  create(@Body() createServerDto: CreateServerDto) {
    return this.serverService.create(
      createServerDto.ownerId,
      createServerDto.name,
    );
  }
}
