import { FastifyInstance } from 'fastify';
import { verificarToken, verificarPermissao } from '../middleware/auth';
import { prisma } from '../lib/prisma';

interface RegisterAlunoInput {
  nome: string;
  cpf: string;
  nomeResponsavel: string;
  dataNascimento: string;
  endereco: string;
  telefone: string;
}

export async function alunoRoutes(server: FastifyInstance) {
  // Rota para registrar um novo aluno (somente para master)
  server.post<{ Body: RegisterAlunoInput }>('/alunos', { 
    preHandler: [verificarToken, verificarPermissao(['master'])] 
  }, async (request, reply) => {
    try {
      const novoAluno = await prisma.aluno.create({
        data: request.body,
      });
      reply.status(201).send(novoAluno);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para buscar todos os alunos (permitido para master, admin e operador)
  server.get('/relatorios/alunos', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin', 'operador'])] 
  }, async (request, reply) => {
    try {
      const alunos = await prisma.aluno.findMany();
      reply.status(200).send(alunos);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para buscar um aluno por ID (permitido para master, admin e operador)
  server.get('/alunos/:id', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin', 'operador'])] 
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const aluno = await prisma.aluno.findUnique({
        where: { id: Number(id) },
      });
      if (!aluno) {
        return reply.status(404).send({ error: 'Aluno não encontrado' });
      }
      reply.status(200).send(aluno);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para atualizar um aluno por ID (permitido para master e admin)
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
          dataNascimento: new Date(dataNascimento), // Convertendo string para Date
          endereco,
          telefone,
        },
      });

      reply.status(200).send(alunoAtualizado);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
}
