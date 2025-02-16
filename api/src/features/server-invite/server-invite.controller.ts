import { Body, Controller, Post } from '@nestjs/common';
import ApiResponse, { ApiResponseWithError } from '../../common/ApiResponse';
import ServerInviteService from './providers/server-invite.service';
import CreateServerInviteDto from './dto/create-server-invite.dto';
import ServerInviteResponseDto from './dto/server-invite-response.dto';
import { ErrorCode } from '../../common/errors/error-code';

@Controller('server/invite')
export class ServerInviteController {
  constructor(private readonly serverInviteService: ServerInviteService) {}

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
}
