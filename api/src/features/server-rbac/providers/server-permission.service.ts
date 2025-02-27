import { Injectable } from '@nestjs/common';
import { ServerPermissionDynamoDbRepository } from './server-permission.dynamo.repository';
import ServerPermission from '../entities/server-permission.entity';

@Injectable()
export default class ServerPermissionService {
  constructor(
    private readonly serverPermissionRepo: ServerPermissionDynamoDbRepository,
  ) {}

  public async userHasServerPermission(
    serverId: string,
    userId: string,
    roleIds: string[],
    permission: string,
  ): Promise<boolean> {
    const userPermissions = await this.serverPermissionRepo.getUserPermissions(
      serverId,
      userId,
      roleIds,
      permission,
    );

    if (userPermissions.length === 0) {
      return false;
    }
  }

  public checkPermissionHierarchy(
    targetPermission: string,
    userPermissions: ServerPermission[],
  ) {
    for (const permission of userPermissions) {
      if (permission) {
        return permission.allows(targetPermission);
      }
    }
  }
}
