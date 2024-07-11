import 'dotenv/config'
import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_DRIVER: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables!', _env.error.format())
  throw new Error('Invalid environment variables!')
}

export const env = _env.data
