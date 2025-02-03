// eslint @typescript-eslint/no-unsafe-member-access: 0

import { z } from 'zod';

export const configSchema = z.object({
  database: z.object({
    dynamoDb: z.object({
      dynamoDbMetadataTable: z.string(),
    }),
  }),
});

export type Configuration = z.infer<typeof configSchema>;

export default () => ({
  database: {
    dynamoDb: {
      dynamoDbMetadataTable: process.env.DYNAMODB_METADATA_TABLE,
    },
  },
});
