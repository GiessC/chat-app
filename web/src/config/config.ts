import { z } from 'zod';

const configSchema = z.object({
  USER_POOL_ID: z.string().min(1, { message: 'User pool ID is required.' }),
  USER_POOL_CLIENT_ID: z
    .string()
    .min(1, { message: 'User pool client ID is required.' }),
});
type Configuration = z.infer<typeof configSchema>;

function getConfig(): Configuration {
  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  const parsedConfig = configSchema.safeParse(envVars);

  if (!parsedConfig.success) {
    throw new Error(
      `Invalid environment configuration. The following variables are missing or invalid: ${Object.entries(
        parsedConfig.error.flatten().fieldErrors,
      )
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}`,
    );
  }

  return parsedConfig.data;
}

export const config = getConfig();
