import 'dotenv/config'; // Carrega o .env, deve ser a primeira linha antes de qualquer outra importação
import Fastify from 'fastify';
import { cursoRoutes } from './routes/cursoRoutes';
import { alunoRoutes } from './routes/alunoRoutes';
import { authRoutes } from './routes/authRoutes';
import { financeiroRoutes } from './routes/financeiroRoutes';
import { usuarioRoutes } from './routes/usuarioRoutes';
import { env } from './env';

const server = Fastify();

server.register(cursoRoutes);
server.register(alunoRoutes);
server.register(authRoutes);
server.register(financeiroRoutes);
server.register(usuarioRoutes);

server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em: ${address}`);
});
