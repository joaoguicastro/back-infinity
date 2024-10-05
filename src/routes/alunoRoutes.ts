import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { registerAluno } from '../use-case/register';
import { getStudentReport } from '../use-case/getStudentReport';

interface RegisterAlunoInput {
  nome: string;
  cpf: string;
  nomeResponsavel: string;
  dataNascimento: string; // Altere para string
  endereco: string;
}

export async function alunoRoutes(server: FastifyInstance) {
    server.post<{ Body: RegisterAlunoInput }>('/alunos', { preHandler: [verificarToken] }, async (request, reply) => {
        try {
            const novoAluno = await registerAluno(request.body);
            reply.status(201).send(novoAluno);
        } catch (error) {
            reply.status(400).send({ error: (error as Error).message });
        }
    });

    server.get('/relatorios/alunos', { preHandler: [verificarToken] }, async (request, reply) => {
        try {
          const alunos = await getStudentReport();
          reply.status(200).send(alunos);
        } catch (error) {
          reply.status(400).send({ error: (error as Error).message });
        }
      });
}
