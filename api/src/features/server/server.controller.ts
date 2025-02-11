import { Controller, Post, Body } from '@nestjs/common';
import { ServerService } from './providers/server.service';
import { CreateServerDto } from './dto/create-server.dto';
import ApiResponse, {
  ApiResponseWithError,
  ErrorCode,
} from '../../common/ApiResponse';
import ServerResponseDto from './dto/server-response.dto';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  public async create(
    @Body() createServerDto: CreateServerDto,
  ): Promise<ApiResponse<ServerResponseDto>> {
    try {
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
    } catch (error: unknown) {
      console.error(`Server controller error caused by: ${String(error)}`);
      return new ApiResponseWithError<ServerResponseDto>(
        'Failed to create server.',
        ErrorCode.InternalError,
      );
    }
  }
}
