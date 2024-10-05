import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function verificarToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      reply.status(401).send({ error: 'Token não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, 'segredo_super_secreto') as { userId: number; cargo: string };

    request.user = payload;
  } catch (err) {
    reply.status(401).send({ error: 'Token inválido' });
  }
}
