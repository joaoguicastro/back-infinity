import { FastifyInstance } from 'fastify';
import { loginUser } from '../use-case/loginUser';

interface LoginInput {
  email: string;
  senha: string;
}

export async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: LoginInput }>('/login', async (request, reply) => {
    try {
      const { token, cargo } = await loginUser(request.body);
      reply.status(200).send({ token, cargo });
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  });
}
