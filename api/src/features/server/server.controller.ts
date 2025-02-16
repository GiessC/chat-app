import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServerService } from './providers/server.service';
import { CreateServerDto } from './dto/create-server.dto';
import ApiResponse, { ListApiResponse } from '../../common/ApiResponse';
import ServerResponseDto from './dto/server-response.dto';
import JoinServerDto from './dto/join-server.dto';
import ServerMemberResponseDto from './dto/server-member-response.dto';
import UpdateMemberDto from './dto/update-member.dto';

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

  @Patch(':serverId/members/:userId')
  public async update(
    @Param('serverId', new ParseUUIDPipe()) serverId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<ApiResponse<ServerMemberResponseDto>> {
    const serverMember = await this.serverService.updateMember(
      serverId,
      userId,
      updateMemberDto,
    );
    const serverMemberResponseDto: ServerMemberResponseDto = {
      serverId: serverMember.serverId,
      userId: serverMember.userId,
      username: serverMember.username,
      joinedAt: serverMember.joinedAt,
      serverNickname: serverMember.serverNickname,
      isBanned: serverMember.isBanned,
      isDeafened: serverMember.isDeafened,
      isMuted: serverMember.isMuted,
      roleIds: serverMember.roleIds,
    };
    return new ApiResponse<ServerMemberResponseDto>(
      `Updated member '${serverMember.username}'`,
      serverMemberResponseDto,
    );
  }

  @Post('join')
  public async join(
    @Body() joinServerDto: JoinServerDto,
  ): Promise<ApiResponse<ServerResponseDto>> {
    const server = await this.serverService.join(
      joinServerDto.userId,
      joinServerDto.username,
      joinServerDto.inviteCode,
    );
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

  @Post('leave')
  public async leave(
    @Body() { serverId, userId }: { serverId: string; userId: string },
  ): Promise<ApiResponse<ServerResponseDto>> {
    await this.serverService.removeMember(serverId, userId);
    return new ApiResponse('Left server');
  }

  @Post('kick')
  public async kick(
    @Body() { serverId, userId }: { serverId: string; userId: string },
  ): Promise<ApiResponse<ServerResponseDto>> {
    await this.serverService.removeMember(serverId, userId);
    return new ApiResponse('Kicked user from server');
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

  @Get('members')
  public async listMembersByServerId(
    @Body() { serverId }: { serverId: string },
  ): Promise<ApiResponse<ServerMemberResponseDto>> {
    const members = await this.serverService.getUsersByServer(serverId);
    const memberResponseDtos: ServerMemberResponseDto[] = members.map(
      (member) => ({
        serverId: member.serverId,
        userId: member.userId,
        username: member.username,
        joinedAt: member.joinedAt,
        serverNickname: member.serverNickname,
        isBanned: member.isBanned,
        isDeafened: member.isDeafened,
        isMuted: member.isMuted,
        roleIds: member.roleIds,
      }),
    );
    return new ListApiResponse<ServerMemberResponseDto>(
      `Listed members for server '${serverId}'`,
      memberResponseDtos,
    );
  }
}
