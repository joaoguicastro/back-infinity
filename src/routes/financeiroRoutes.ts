import { FastifyInstance } from 'fastify';
import { verificarToken, verificarPermissao } from '../middleware/auth';
import { createFinanceiro } from '../use-case/createFinanceiro';
import { getDebtorsReport } from '../use-case/getDebtorsReport';
import { darBaixaNoPagamento, estornarPagamento } from '../use-case/baixaEestornoPagamento';
import { prisma } from '../lib/prisma';

interface CreateFinanceiroInput {
  alunoId: number;
  cursoId: number;
  valor: number;
  quantidadeParcelas: number;
  status: string;
  dataPagamento?: Date;
  dataVencimento: Date; // Campo para data de vencimento
}

export async function financeiroRoutes(server: FastifyInstance) {
  // Rota para criar um novo registro financeiro - Apenas "master" e "admin" têm acesso
  server.post<{ Body: CreateFinanceiroInput }>('/financeiro', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    try {
      const { alunoId, cursoId, valor, quantidadeParcelas, status, dataPagamento } = request.body;

      const novoFinanceiro = await createFinanceiro({
        alunoId,
        cursoId,
        valor,
        quantidadeParcelas,
        status,
        dataPagamento,
      });

      reply.status(201).send(novoFinanceiro);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para obter o relatório de devedores - Apenas "master" tem acesso
  server.get('/relatorios/devedores', { 
    preHandler: [verificarToken, verificarPermissao(['master'])] 
  }, async (request, reply) => {
    try {
      const devedores = await getDebtorsReport();
      reply.status(200).send(devedores);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para dar baixa no pagamento de uma parcela específica - Apenas "master" e "admin" têm acesso
  server.put<{ Params: { id: string } }>('/financeiro/baixa/:id', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const result = await darBaixaNoPagamento(Number(id));
      reply.status(200).send(result);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para estornar o pagamento de uma parcela específica - Apenas "master" e "admin" têm acesso
  server.put<{ Params: { id: string } }>('/financeiro/estorno/:id', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const result = await estornarPagamento(Number(id));
      reply.status(200).send(result);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
  server.get('/relatorios/recebimentos-mensais', { preHandler: [verificarToken] }, async (request, reply) => {
    const dataInicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dataFimMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    try {
      const recebimentos = await prisma.financeiro.findMany({
        where: {
          status: 'pago',  // Considerando que 'pago' seja o status para indicar que foi quitado
          dataPagamento: {
            gte: dataInicioMes,
            lte: dataFimMes
          }
        }
      });

      const totalRecebido = recebimentos.reduce((total, financeiro) => total + financeiro.valor, 0);

      reply.status(200).send({ totalRecebido });
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  });
}
