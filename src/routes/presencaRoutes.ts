import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { registrarPresenca } from '../use-case/registrarPresenca'; 
import { prisma } from '../lib/prisma';

export async function presencaRoutes(server: FastifyInstance) {

  server.post<{ Body: { alunoId: number; cursoId: number; presente: boolean; observacao?: string } }>('/presenca', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const { alunoId, cursoId, presente, observacao } = request.body;
      const data = new Date();

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


  server.get('/presenca/curso/:cursoId', { preHandler: [verificarToken] }, async (request, reply) => {
    const { cursoId } = request.params as { cursoId: string };

    try {

      const presencas = await prisma.presenca.findMany({
        where: { cursoId: Number(cursoId) }, 
      });

      if (presencas.length === 0) {
        return reply.status(404).send({ error: 'Nenhuma presença encontrada para este curso.' });
      }

      reply.status(200).send(presencas); 
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message }); 
    }
  });
}
