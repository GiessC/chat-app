import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { ServerService } from './providers/server.service';

describe('ServerController', () => {
  let controller: ServerController;

  const ownerId = 'e7212fa9-fee3-41ae-9481-0dcd7392da0c';
  const name = 'Test Server';

  const serverServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [ServerService],
    })
      .overrideProvider(ServerService)
      .useValue(serverServiceMock)
      .compile();

    controller = module.get<ServerController>(ServerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('responds with error when server creation fails', async () => {
    //   Given
    serverServiceMock.create.mockRejectedValueOnce(new Error('Fake error'));

    //   When
    const response = await controller.create({
      ownerId,
      name,
    });

    //   Then
    expect(response.error).toBe(true);
    expect(response.message).toBe('Failed to create server.');
  });

  it('responds with success when server creation succeeds', async () => {
    //   Given
    serverServiceMock.create.mockResolvedValueOnce({
      serverId: '99d6fc9a-2fb6-4154-b8f2-7b0a5d80cd65',
      createdAt: new Date(),
      ownerId,
      name,
    });

    //   When
    const response = await controller.create({
      ownerId,
      name,
    });

    //   Then
    expect(response.error).toBe(false);
    expect(response.message).toBe(`Created server '${name}'`);
    expect(response.item?.ownerId).toBe(ownerId);
    expect(response.item?.name).toBe(name);
  });
});
