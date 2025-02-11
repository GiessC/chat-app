import { ServerDynamoDbRepository } from './server.dynamo.repository';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Server } from '../entities/server.entity';
import DynamoDbService from '../../../database/dynamo-db.service';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

describe('ServerDynamoDbRepository', () => {
  let repository: ServerDynamoDbRepository;

  const dynamoDbMock = {
    save: jest.fn(),
  };

  const tableName = 'test-dynamodb-server-tbl';
  const configServiceMock = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'DYNAMODB_TABLE_NAME') {
        return tableName;
      }
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ServerDynamoDbRepository, ConfigService, DynamoDbService],
    })
      .overrideProvider(DynamoDbService)
      .useValue(dynamoDbMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    repository = moduleRef.get<ServerDynamoDbRepository>(
      ServerDynamoDbRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const ownerId = '99d6fc9a-2fb6-4154-b8f2-7b0a5d80cd65';
    const name = 'RIP Gubaf Realm';
    const server: Server = new Server(ownerId, name);

    it('create fails if pk and sk exists', async () => {
      //   Given
      //   When
      dynamoDbMock.save.mockRejectedValueOnce(
        new ConditionalCheckFailedException({
          message: 'The conditional request failed',
          $metadata: {},
        }),
      );

      //   Then
      await expect(repository.create(server)).rejects.toThrow(
        'Server already exists',
      );
    });

    it('creates in corresponding dynamodb table', async () => {
      //   Given
      //   When
      await repository.create(server);

      //   Then
      expect(dynamoDbMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: tableName,
        }),
      );
    });

    it('create returns server on success', async () => {
      //   Given
      //   When
      const response = await repository.create(server);

      //   Then
      expect(response).toEqual(server);
    });
  });
});
