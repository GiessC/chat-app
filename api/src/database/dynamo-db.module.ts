import { Module } from '@nestjs/common';
import DynamoDbService from './dynamo-db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DynamoDbService],
  exports: [DynamoDbService],
})
export class DynamoDbModule {}
