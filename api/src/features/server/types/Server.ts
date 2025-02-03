export default class Server {
  constructor(
    private serverId: string,
    private ownerId: string,
    private name: string,
    private createdAt: Date,
  ) {}
}
