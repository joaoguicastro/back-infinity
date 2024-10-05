import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { createUser } from '../use-case/createUser';

interface CreateUserInput {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

export async function usuarioRoutes(server: FastifyInstance) {
  server.post<{ Body: CreateUserInput }>('/usuarios', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const novoUsuario = await createUser(request.body);
      reply.status(201).send(novoUsuario);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
}
