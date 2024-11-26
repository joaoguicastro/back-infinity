import { FastifyInstance, FastifyRequest } from 'fastify';
import { verificarToken, verificarPermissao } from '../middleware/auth';
import { prisma } from '../lib/prisma';
  import bcrypt from 'bcrypt';

interface RegisterAlunoInput {
  nome: string;
  cpf: string;
  nomeResponsavel: string;
  dataNascimento: string;
  endereco: string;
  telefone: string;
  cursoId: number;
}
interface Params {
  id: string;
}

export async function alunoRoutes(server: FastifyInstance) {
  server.post<{ Body: RegisterAlunoInput }>('/alunos', { preHandler: [verificarToken, verificarPermissao(['master'])] }, async (request, reply) => {
    try {
      const { nome, cpf, nomeResponsavel, dataNascimento, endereco, telefone, cursoId } = request.body;
  
      const novoAluno = await prisma.aluno.create({
        data: {
          nome,
          cpf,
          nomeResponsavel,
          dataNascimento: new Date(dataNascimento),
          endereco,
          telefone,
          cursoMatriculadoId: cursoId,
        },
      });
      reply.status(201).send(novoAluno);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.get('/relatorios/alunos',
    {
      preHandler: [verificarToken, verificarPermissao(['master', 'admin', 'operador'])],
    },
    async (request, reply) => {
      try {
        const alunos = await prisma.aluno.findMany({
          include: {
            cursoMatriculado: {
              select: {
                nome: true,
              },
            },
          },
        });
        reply.status(200).send(alunos);
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    }
  );
  

  server.get<{ Params: { id: string } }>(
    '/alunos/:id',
    { 
      preHandler: [verificarToken, verificarPermissao(['master', 'admin', 'operador'])] 
    },
    async (request, reply) => {
      try {
        const aluno = await prisma.aluno.findUnique({
          where: { id: Number(request.params.id) },
          include: {
            cursoMatriculado: {
              include: {
                financeiro: {
                  orderBy: [
                    { status: 'asc' },
                    { dataVencimento: 'asc' }
                  ]
                }
              }
            }
          }
        });        
        if (!aluno) {
          reply.status(404).send({ error: 'Aluno não encontrado' });
          return;
        }
  
        reply.status(200).send(aluno);
      } catch (error) {
        console.error('Erro ao buscar detalhes do aluno:', error);
        reply.status(500).send({ error: 'Erro interno do servidor' });
      }
    }
  );
  
  server.put<{ Body: RegisterAlunoInput; Params: { id: string } }>('/alunos/:id', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    const { id } = request.params;
    const { nome, cpf, nomeResponsavel, dataNascimento, endereco, telefone } = request.body;

    try {
      const alunoAtualizado = await prisma.aluno.update({
        where: { id: Number(id) },
        data: {
          nome,
          cpf,
          nomeResponsavel,
          dataNascimento: new Date(dataNascimento), 
          endereco,
          telefone,
        },
      });

      reply.status(200).send(alunoAtualizado);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.put<{ Params: { alunoId: string; cursoId: string } }>('/alunos/vincular/:alunoId/:cursoId', { preHandler: [verificarToken] }, async (request, reply) => {
    const { alunoId, cursoId } = request.params as { alunoId: string; cursoId: string };

    try {
      const alunoAtualizado = await prisma.aluno.update({
        where: { id: Number(alunoId) },
        data: { cursoMatriculadoId: Number(cursoId) },
      });

      reply.status(200).send(alunoAtualizado); 
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

server.delete<{ Params: { id: string }; Body: { senha: string } }>(
  '/alunos/:id',
  { preHandler: [verificarToken] },
  async (request, reply) => {
    try {
      const { id } = request.params; // ID do aluno a ser deletado
      const { senha } = request.body; // Senha fornecida pelo usuário

      if (!request.user) {
        return reply.status(401).send({ error: 'Usuário não autenticado.' });
      }

      // Buscar o usuário autenticado no banco
      const usuario = await prisma.usuario.findUnique({
        where: { id: request.user.userId },
      });

      if (!usuario) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
      }

      // Comparar a senha fornecida com o hash armazenado
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return reply.status(403).send({ error: 'Senha inválida.' });
      }

      // Deletar o aluno
      await prisma.aluno.delete({
        where: { id: Number(id) },
      });

      reply.status(200).send({ message: 'Aluno deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao processar requisição:', error);
      reply.status(400).send({ error: (error as Error).message });
    }
  }
);

    
}
