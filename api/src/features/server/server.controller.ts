import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ServerService } from './providers/server.service';
import { CreateServerDto } from './dto/create-server.dto';
import ApiResponse from '../../common/ApiResponse';
import ServerResponseDto from './dto/server-response.dto';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  public async create(
    @Body() createServerDto: CreateServerDto,
  ): Promise<ApiResponse<ServerResponseDto>> {
    const server = await this.serverService.create(
      createServerDto.ownerId,
      createServerDto.name,
    );
    const serverResponseDto: ServerResponseDto = {
      serverId: server.serverId,
      ownerId: server.ownerId,
      name: server.name,
      createdAt: server.createdAt,
    };
    return new ApiResponse<ServerResponseDto>(
      `Created server '${createServerDto.name}'`,
      serverResponseDto,
    );
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  public async join(
    @Param('serverId') serverId: string,
  ): Promise<ApiResponse<ServerResponseDto>> {
    const userId = 'userId'; // TODO: Get userId from auth
    const username = 'username'; // TODO: Get username from auth
    const server = await this.serverService.join(serverId, userId, username);
    const serverResponseDto: ServerResponseDto = {
      serverId: server.serverId,
      ownerId: server.ownerId,
      name: server.name,
      createdAt: server.createdAt,
    };
    return new ApiResponse<ServerResponseDto>(
      `Joined server '${server.name}'`,
      serverResponseDto,
    );
  }
}
