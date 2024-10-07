import { z } from 'zod';

// Definindo o esquema de validação para as variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"), // Verifica que a string não está vazia
  DATABASE_URL: z.string().url().optional(), // Exemplo para garantir que a variável de conexão do banco seja uma URL válida (opcional)
});

// Realiza a validação das variáveis de ambiente
const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('❌ Invalid environment variable', _env.error.format());
  throw new Error('Invalid environment variable');
}

// Exportando as variáveis de ambiente validadas para serem utilizadas no projeto
export const env = _env.data;
