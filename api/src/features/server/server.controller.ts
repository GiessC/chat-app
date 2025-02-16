import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { ServerService } from './providers/server.service';
import { CreateServerDto } from './dto/create-server.dto';
import ApiResponse, { ListApiResponse } from '../../common/ApiResponse';
import ServerResponseDto from './dto/server-response.dto';
import TestJoinServerDto from './dto/join-server.dto';

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
    @Body() { serverId, userId, username }: TestJoinServerDto,
  ): Promise<ApiResponse<ServerResponseDto>> {
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

  @Get('list')
  public async listByUserId(
    @Body() { userId }: { userId: string },
  ): Promise<ApiResponse<ServerResponseDto>> {
    const servers = await this.serverService.getServersByUser(userId);
    const serverResponseDtos: ServerResponseDto[] = servers.map((server) => ({
      serverId: server.serverId,
      ownerId: server.ownerId,
      name: server.name,
      createdAt: server.createdAt,
    }));
    return new ListApiResponse<ServerResponseDto>(
      `Listed servers for user '${userId}'`,
      serverResponseDtos,
    );
  }
}
