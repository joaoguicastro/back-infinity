import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { registrarPresenca } from '../use-case/registrarPresenca'; // Ajuste o caminho conforme necessário
import { prisma } from '../lib/prisma';

export async function presencaRoutes(server: FastifyInstance) {
  // Rota para registrar a presença
  server.post<{ Body: { alunoId: number; cursoId: number; presente: boolean; observacao?: string } }>('/presenca', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const { alunoId, cursoId, presente, observacao } = request.body;
      const data = new Date(); // Data atual

      const novaPresenca = await registrarPresenca({
        alunoId,
        cursoId,
        data,
        presente,
        observacao,
      });

      reply.status(201).send(novaPresenca);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para buscar todas as presenças de um aluno (opcional)
  server.get('/presenca/aluno/:id', { preHandler: [verificarToken] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const presencas = await prisma.presenca.findMany({
        where: { alunoId: Number(id) },
      });
      reply.status(200).send(presencas);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para buscar todas as presenças de um curso (opcional)
  server.get('/presenca/curso/:cursoId', { preHandler: [verificarToken] }, async (request, reply) => {
    const { cursoId } = request.params as { cursoId: string }; // Obtendo o cursoId da URL

    try {
      // Buscando as presenças associadas ao curso
      const presencas = await prisma.presenca.findMany({
        where: { cursoId: Number(cursoId) }, // Filtrando por cursoId
      });

      // Verifica se há presenças registradas
      if (presencas.length === 0) {
        return reply.status(404).send({ error: 'Nenhuma presença encontrada para este curso.' });
      }

      reply.status(200).send(presencas); // Retornando as presenças encontradas
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message }); // Retornando erro em caso de falha
    }
  });
}
