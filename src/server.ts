import 'dotenv/config'; // Primeira linha do arquivo
import Fastify from 'fastify'; // Importando o Fastify
import { cursoRoutes } from './routes/cursoRoutes';
import { alunoRoutes } from './routes/alunoRoutes';
import { authRoutes } from './routes/authRoutes';
import { financeiroRoutes } from './routes/financeiroRoutes';
import { usuarioRoutes } from './routes/usuarioRoutes';
import { env } from './env';
import cors from '@fastify/cors';
import { presencaRoutes } from './routes/presencaRoutes';

export function buildServer() {
  const server = Fastify();

  // Registrar rotas
  server.register(cursoRoutes);
  server.register(alunoRoutes);
  server.register(authRoutes);
  server.register(financeiroRoutes);
  server.register(usuarioRoutes);
  server.register(presencaRoutes);

  // Configurar CORS
  server.register(cors, {
    origin: '*',
  });

  return server;
}

// Executar o servidor apenas quando o arquivo for rodado diretamente
if (require.main === module) {
  const server = buildServer();
  server.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Servidor rodando em: ${address}`);
  });
}
