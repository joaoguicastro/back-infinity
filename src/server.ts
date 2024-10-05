import Fastify from 'fastify'; // Importando o Fastify
import { cursoRoutes } from './routes/cursoRoutes';
import { alunoRoutes } from './routes/alunoRoutes';
import { authRoutes } from './routes/authRoutes';
import { financeiroRoutes } from './routes/financeiroRoutes';
import { usuarioRoutes } from './routes/usuarioRoutes';
import { env } from './env';
import 'dotenv/config'; 
import { z } from 'zod'; 

const server = Fastify(); 

server.register(cursoRoutes);
server.register(alunoRoutes);
server.register(authRoutes);
server.register(financeiroRoutes);
server.register(usuarioRoutes);

server.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em: ${address}`);
});
