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
    
    // Verifique se o JWT_SECRET foi carregado corretamente
    if (!process.env.JWT_SECRET) {
      reply.status(500).send({ error: 'JWT_SECRET não está configurado' });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as { userId: number; cargo: string };
    request.user = payload;
  } catch (err) {
    reply.status(401).send({ error: 'Token inválido' });
  }
}
