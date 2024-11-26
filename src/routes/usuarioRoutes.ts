import { FastifyInstance } from 'fastify';
import { verificarToken, verificarPermissao } from '../middleware/auth';
import { createUser } from '../use-case/createUser';
import { prisma } from '../lib/prisma'; // Importação do Prisma
import bcrypt from 'bcryptjs';

interface CreateUserInput {
  nome: string;
  email: string;
  senha: string;
  cargo: string;
}

export async function usuarioRoutes(server: FastifyInstance) {
  // Criar usuário
  server.post<{ Body: CreateUserInput }>('/usuarios', { 
    preHandler: [verificarToken, verificarPermissao(['master'])] 
  }, async (request, reply) => {
    try {
      const novoUsuario = await createUser(request.body);
      reply.status(201).send(novoUsuario);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Listar todos os usuários
  server.get('/usuarios', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          senha: true,
        },
      });
      reply.status(200).send(usuarios);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Deletar usuário
  server.delete<{ Params: { id: string } }>('/usuarios/:id', { 
    preHandler: [verificarToken, verificarPermissao(['master'])] 
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
      });

      if (!usuario) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
      }

      await prisma.usuario.delete({
        where: { id: Number(id) },
      });

      reply.status(200).send({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.post<{ Body: { id: number; senha: string } }>('/usuarios/verificar-senha', async (request, reply) => {
    const { id, senha } = request.body;

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id },
      });

      if (!usuario) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
      }

      // Verificar a senha usando bcrypt
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (senhaValida) {
        reply.status(200).send({ valid: true });
      } else {
        reply.status(401).send({ valid: false, message: 'Senha inválida.' });
      }
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  });
}
