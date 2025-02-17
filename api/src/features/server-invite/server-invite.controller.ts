import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import ApiResponse, {
  ApiResponseWithError,
  ListApiResponse,
} from '../../common/ApiResponse';
import ServerInviteService from './providers/server-invite.service';
import CreateServerInviteDto from './dto/create-server-invite.dto';
import ServerInviteResponseDto from './dto/server-invite-response.dto';
import { ErrorCode } from '../../common/errors/error-code';

@Controller('server/invite')
export class ServerInviteController {
  constructor(private readonly serverInviteService: ServerInviteService) {}

  @Get('list')
  public async list(
    @Body() { serverId }: { serverId: string },
  ): Promise<ApiResponse<ServerInviteResponseDto>> {
    try {
      const serverInvites = await this.serverInviteService.list(serverId);
      const responseDtos: ServerInviteResponseDto[] = serverInvites.map(
        (invite) => ({
          inviteCode: invite.getInviteCode(),
          creatorId: invite.creatorId,
          expirationDate: invite.expirationDate,
          maxUses: invite.maxUses,
        }),
      );
      return new ListApiResponse<ServerInviteResponseDto>(
        'Listed server invites',
        responseDtos,
      );
    } catch (error: unknown) {
      console.error(
        `Server invite controller error caused by: ${String(error)}`,
      );
      return new ApiResponseWithError<ServerInviteResponseDto>(
        'Failed to list server invites.',
        ErrorCode.INTERNAL,
      );
    }
  }

  @Post('create')
  public async create(
    @Body() createServerInviteDto: CreateServerInviteDto,
  ): Promise<ApiResponse<ServerInviteResponseDto>> {
    try {
      const serverInvite = await this.serverInviteService.create(
        createServerInviteDto.serverId,
        createServerInviteDto.creatorId,
        createServerInviteDto.expirationDays,
        createServerInviteDto.maxUses,
      );
      const responseDto: ServerInviteResponseDto = {
        inviteCode: serverInvite.getInviteCode(),
        creatorId: serverInvite.creatorId,
        expirationDate: serverInvite.expirationDate,
        maxUses: serverInvite.maxUses,
      };
      return new ApiResponse<ServerInviteResponseDto>(
        'Created server invite',
        responseDto,
      );
    } catch (error: unknown) {
      console.error(
        `Server invite controller error caused by: ${String(error)}`,
      );
      return new ApiResponseWithError<ServerInviteResponseDto>(
        'Failed to create server invite.',
        ErrorCode.INTERNAL,
      );
    }
  }

  @Delete('revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async revoke(
    @Body() { serverId, inviteId }: { serverId: string; inviteId: string },
  ): Promise<ApiResponse<ServerInviteResponseDto>> {
    try {
      await this.serverInviteService.revoke(serverId, inviteId);
      return new ApiResponse<ServerInviteResponseDto>('Revoked server invite');
    } catch (error: unknown) {
      console.error(
        `Server invite controller error caused by: ${String(error)}`,
      );
      return new ApiResponseWithError<ServerInviteResponseDto>(
        'Failed to revoke server invite.',
        ErrorCode.INTERNAL,
      );
    }
  }
}
