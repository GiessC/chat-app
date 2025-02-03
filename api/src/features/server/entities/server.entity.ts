import { v4 as uuidv4 } from 'uuid';

export class Server {
  private serverId: string;
  private ownerId: string;
  private name: string;

  constructor(ownerId: string, name: string, serverId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.serverId = serverId ?? (uuidv4() as string);
    this.ownerId = ownerId;
    this.name = name;
  }
}
