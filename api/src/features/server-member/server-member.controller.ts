import { Controller } from '@nestjs/common';
import { ServerMemberDynamoDbRepository } from './providers/server-member.dynamo.repository';

@Controller('server-member')
export class ServerMemberController {
  constructor(
    private readonly serverMemberRepo: ServerMemberDynamoDbRepository,
  ) {}
}
