import { Color } from '../../../utils/color';

export default class RoleDynamoDbDto {
  public readonly pk: string;
  public readonly sk: string;
  public readonly gsi1pk: string;
  public readonly gsi1sk: string;
  public readonly serverId: string;
  public readonly roleId: string;
  public readonly name: string;
  public readonly color: Color;
  public readonly createdAt: string;

  public static generatePk(serverId: string, roleId: string) {
    return `SERVER#${serverId}#ROLE#${roleId}`;
  }

  public static generateSk() {
    return `ROLE`;
  }

  public constructor(
    serverId: string,
    roleId: string,
    name: string,
    color: Color,
    createdAt: string = new Date().toISOString(),
  ) {
    this.pk = RoleDynamoDbDto.generatePk(serverId, roleId);
    this.sk = RoleDynamoDbDto.generateSk();
    this.gsi1pk = serverId;
    this.gsi1sk = `ROLE#${roleId}`;
    this.serverId = serverId;
    this.roleId = roleId;
    this.name = name;
    this.color = color;
    this.createdAt = createdAt;
  }
}
