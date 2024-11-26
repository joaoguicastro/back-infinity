import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { registrarPresenca } from '../use-case/registrarPresenca'; 
import { prisma } from '../lib/prisma';
import { buscarPresencasPorData } from '../use-case/buscarPresencasPorData';

export async function presencaRoutes(server: FastifyInstance) {

  server.post<{ Body: { alunoId: number; cursoId: number; presente: boolean; observacao?: string; data: string } }>('/presenca', { preHandler: [verificarToken] }, async (request, reply) => {
    const { alunoId, cursoId, presente, observacao, data } = request.body;
  
    // Verificar se todos os campos obrigatórios estão presentes
    if (!alunoId || !cursoId || presente === undefined || !data) {
      return reply.status(400).send({ error: 'Todos os campos obrigatórios devem ser fornecidos: alunoId, cursoId, presente e data.' });
    }
  
    // Validação do formato da data
    if (isNaN(Date.parse(data))) {
      return reply.status(400).send({ error: 'Formato de data inválido. Use o formato YYYY-MM-DD.' });
    }
  
    try {
      const dataValida = new Date(data + 'T00:00:00.000Z');
      const novaPresenca = await prisma.presenca.create({
        data: {
          alunoId,
          cursoId,
          presente,
          observacao,
          data: dataValida,
        },
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
  server.get('/presenca', { preHandler: [verificarToken] }, async (request, reply) => {
    let { data } = request.query as { data: string };
  
    if (!data) {
      return reply.status(400).send({ error: 'Data é obrigatória.' });
    }
  
    // Tentativa de normalizar o formato da data
    if (/^\d{2}-\d{2}-\d{4}$/.test(data)) {
      const [dia, mes, ano] = data.split('-');
      data = `${ano}-${mes}-${dia}`;
    }
  
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return reply.status(400).send({ error: 'Formato de data inválido. Use o formato YYYY-MM-DD.' });
    }
  
    try {
      const inicioDoDia = new Date(`${data}T00:00:00.000Z`);
      const fimDoDia = new Date(`${data}T23:59:59.999Z`);
  
      const presencas = await prisma.presenca.findMany({
        where: {
          data: {
            gte: inicioDoDia,
            lte: fimDoDia,
          },
        },
        include: {
          aluno: true,
          curso: true,
        },
      });
  
      if (presencas.length === 0) {
        return reply.status(404).send({ error: 'Nenhuma presença encontrada para esta data.' });
      }
  
      reply.status(200).send(presencas);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
}
