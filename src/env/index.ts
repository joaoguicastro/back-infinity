import { z } from 'zod';

console.log('Todas as variáveis de ambiente:', process.env);

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"), // Verifica que a string não está vazia
  DATABASE_URL: z.string().url().optional(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('❌ Invalid environment variable', _env.error.format());
  throw new Error('Invalid environment variable');
}

export const env = _env.data;
