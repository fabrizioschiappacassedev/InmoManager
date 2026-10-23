import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
});

export const validateEnv = (config: Record<string, unknown>) =>
  schema.parse(config);