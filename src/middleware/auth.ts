import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../env'; // Importando variáveis de ambiente corretamente

export async function verificarToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      reply.status(401).send({ error: 'Token não fornecido' });
      return;
    }

    // Extrai o token do header 'Authorization' (esperado no formato: 'Bearer TOKEN')
    const token = authHeader.split(' ')[1];
    if (!token) {
      reply.status(401).send({ error: 'Token inválido' });
      return;
    }

    // Verifica o token usando a chave secreta armazenada em JWT_SECRET
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number; cargo: string };

    // Armazena o payload do token no request, para ser usado nas rotas seguintes
    request.user = payload;
  } catch (err) {
    console.error(err);
    reply.status(401).send({ error: 'Token inválido' });
  }
}
