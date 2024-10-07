import 'dotenv/config'; // Certifica que o dotenv está sendo carregado

import Fastify from 'fastify';
import { cursoRoutes } from './routes/cursoRoutes';
import { alunoRoutes } from './routes/alunoRoutes';
import { authRoutes } from './routes/authRoutes';
import { financeiroRoutes } from './routes/financeiroRoutes';
import { usuarioRoutes } from './routes/usuarioRoutes';
import { env } from './env';

// Verificar se a variável de ambiente está sendo carregada
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Adicione esta linha para verificar o valor de JWT_SECRET

const server = Fastify();

server.register(cursoRoutes);
server.register(alunoRoutes);
server.register(authRoutes);
server.register(financeiroRoutes);
server.register(usuarioRoutes);

server.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em: ${address}`);
});
