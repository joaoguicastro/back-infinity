import { FastifyInstance } from 'fastify';
import { z } from 'zod'; // Importa o Zod para validação
import { verificarToken, verificarPermissao } from '../middleware/auth';
import { createFinanceiro } from '../use-case/createFinanceiro';
import { getDebtorsReport } from '../use-case/getDebtorsReport';
import { darBaixaNoPagamento, estornarPagamento } from '../use-case/baixaEestornoPagamento';
import { prisma } from '../lib/prisma';
import { StatusFinanceiro } from '@prisma/client';

// Função para converter "dd/mm/aaaa" para Date
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // Ajuste do mês: janeiro é 0
};

// Schema de validação para criar financeiro
const CreateFinanceiroSchema = z.object({
  cursoId: z.number().int().positive(),
  valor: z.number().positive(),
  quantidadeParcelas: z.number().int().positive(),
  status: z.enum(['pendente', 'devendo', 'pago']),
  dataVencimento: z
    .string()
    .refine(
      (date) => /\d{2}\/\d{2}\/\d{4}/.test(date), // Verifica o formato "dd/mm/aaaa"
      { message: 'Formato de data inválido. Use "dd/mm/aaaa".' }
    )
    .transform(parseDate), // Converte a data para Date
});

// Tipagem explícita para as rotas
interface BaixaPagamentoParams {
  id: string; // ID do financeiro
}

interface BaixaPagamentoBody {
  desconto: number;
  valorPago: number;
}

export async function financeiroRoutes(server: FastifyInstance) {
  // Rota para criar financeiro
  server.post('/financeiro', {
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])],
  }, async (request, reply) => {
    try {
      // Validação do payload usando Zod
      const payload = CreateFinanceiroSchema.parse(request.body);
      console.log('Payload recebido:', payload);

      const novoFinanceiro = await createFinanceiro(payload);

      console.log('Financeiro criado com sucesso:', novoFinanceiro);
      reply.status(201).send(novoFinanceiro);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erro de validação:', error.errors);
        reply.status(400).send({ error: error.errors });
      } else {
        console.error('Erro ao criar financeiro:', error);
        reply.status(500).send({ error: 'Erro ao criar financeiro' });
      }
    }
  });

  // Rota para relatório de devedores
  server.get('/relatorios/devedores', {
    preHandler: [verificarToken, verificarPermissao(['master'])],
  }, async (request, reply) => {
    try {
      const devedores = await getDebtorsReport();

      console.log('Relatório de Devedores:', devedores);
      reply.status(200).send(devedores);
    } catch (error) {
      console.error('Erro ao buscar relatório de devedores:', error);
      reply.status(500).send({ error: 'Erro ao buscar relatório de devedores' });
    }
  });

  // Rota para dar baixa no pagamento
  server.put<{ Params: BaixaPagamentoParams; Body: BaixaPagamentoBody }>('/financeiro/baixa/:id', {
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])],
  }, async (request, reply) => {
    const { id } = request.params;
    const { desconto, valorPago } = request.body;

    try {
      console.log(`Baixando pagamento para ID: ${id}`);
      const result = await darBaixaNoPagamento(Number(id), desconto, valorPago);

      reply.status(200).send(result);
    } catch (error) {
      console.error('Erro ao dar baixa no pagamento:', error);
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para estorno de pagamento
  server.put<{ Params: BaixaPagamentoParams }>('/financeiro/estorno/:id', {
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])],
  }, async (request, reply) => {
    const { id } = request.params;

    try {
      console.log(`Estornando pagamento para ID: ${id}`);
      const result = await estornarPagamento(Number(id));

      reply.status(200).send(result);
    } catch (error) {
      console.error('Erro ao estornar pagamento:', error);
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para relatório de recebimentos mensais
  server.get('/relatorios/recebimentos-mensais', {
    preHandler: [verificarToken],
  }, async (request, reply) => {
    const dataInicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dataFimMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    try {
      const recebimentos = await prisma.financeiro.findMany({
        where: {
          status: 'pago',
          dataPagamento: {
            gte: dataInicioMes,
            lte: dataFimMes,
          },
        },
      });

      const totalRecebido = recebimentos.reduce((total, financeiro) => total + (financeiro.valorPago || 0), 0);

      console.log(`Total recebido no mês: R$${totalRecebido}`);
      reply.status(200).send({ totalRecebido });
    } catch (error) {
      console.error('Erro ao buscar relatório de recebimentos mensais:', error);
      reply.status(500).send({ error: 'Erro ao buscar relatório de recebimentos mensais' });
    }
  });

  // Rota para atualizar o status
  server.put<{ Params: { id: string }; Body: { novoStatus: StatusFinanceiro } }>('/financeiro/status/:id', {
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])],
  }, async (request, reply) => {
    const { id } = request.params;
    const { novoStatus } = request.body;

    try {
      // Valida se o novo status é válido
      if (!Object.values(StatusFinanceiro).includes(novoStatus)) {
        return reply.status(400).send({ error: 'Status inválido' });
      }

      console.log(`Alterando status do financeiro ID: ${id} para ${novoStatus}`);

      const financeiro = await prisma.financeiro.update({
        where: { id: Number(id) },
        data: { status: novoStatus },
      });

      reply.status(200).send(financeiro);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      reply.status(500).send({ error: 'Erro ao atualizar status' });
    }
  });
}
