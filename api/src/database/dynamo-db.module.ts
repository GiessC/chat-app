import { Module } from '@nestjs/common';
import DynamoDbService from './dynamo-db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DynamoDbService],
})
export class DynamoDbModule {}
