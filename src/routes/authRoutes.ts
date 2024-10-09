import { FastifyInstance } from 'fastify';
import { loginUser } from '../use-case/loginUser';

interface LoginInput {
  email: string;
  senha: string;
}

export async function authRoutes(server: FastifyInstance) {
  // Rota para login
  server.post<{ Body: LoginInput }>('/login', async (request, reply) => {
    try {
      const { email, senha } = request.body;

      // Verifica se email e senha estão presentes
      if (!email || !senha) {
        return reply.status(400).send({ error: 'Email e senha são obrigatórios.' });
      }

      // Função que valida o login e gera o token
      const { token, cargo } = await loginUser({ email, senha });

      // Retorna o token e cargo do usuário
      reply.status(200).send({ token, cargo });
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  });
}
