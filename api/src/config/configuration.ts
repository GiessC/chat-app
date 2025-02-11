// eslint @typescript-eslint/no-unsafe-member-access: 0

import { z } from 'zod';

export const configSchema = z.object({
  dynamoDbMetadataTable: z.string(),
});

export type Configuration = z.infer<typeof configSchema>;

export default () => ({
  dynamoDbMetadataTable: process.env.DYNAMODB_METADATA_TABLE,
});
