import { v4 as uuidv4 } from 'uuid';

export class Server {
  private serverId: string;
  private ownerId: string;
  private name: string;

  constructor(ownerId: string, name: string, serverId?: string) {
    this.serverId = serverId ?? uuidv4();
    this.ownerId = ownerId;
    this.name = name;
  }
}
