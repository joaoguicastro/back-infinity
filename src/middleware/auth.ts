import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../env';

export async function verificarToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as string) as { userId: number, cargo: string };
    
    request.user = { userId: decoded.userId, cargo: decoded.cargo };

  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' });
  }
}

// Função para verificar permissões
export function verificarPermissao(permissoesPermitidas: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !request.user.cargo) {
      return reply.status(403).send({ error: 'Acesso negado: cargo não encontrado' });
    }

    const { cargo } = request.user;

    if (!permissoesPermitidas.includes(cargo)) {
      return reply.status(403).send({ error: 'Acesso negado: você não tem permissão para acessar essa rota' });
    }
  };
}
