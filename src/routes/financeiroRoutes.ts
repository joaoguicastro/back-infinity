import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { createFinanceiro } from '../use-case/createFinanceiro';
import { getDebtorsReport } from '../use-case/getDebtorsReport';

interface CreateFinanceiroInput {
  alunoId: number;
  cursoId: number;
  valor: number;
  status: string;
  dataPagamento?: Date;
}

export async function financeiroRoutes(server: FastifyInstance) {
  server.post<{ Body: CreateFinanceiroInput }>('/financeiro', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const novoFinanceiro = await createFinanceiro(request.body);
      reply.status(201).send(novoFinanceiro);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.get('/relatorios/devedores', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const devedores = await getDebtorsReport();
      reply.status(200).send(devedores);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
}
