import { prisma } from '../lib/prisma';
import { Prisma, StatusFinanceiro } from '@prisma/client'; // Importa o enum gerado pelo Prisma

export class FinanceiroRepository {
  async create(data: { cursoId: number; valor: number; quantidadeParcelas: number; status: StatusFinanceiro; dataPagamento?: Date; dataVencimento: Date }) {
    return prisma.financeiro.create({
      data: {
        cursoId: data.cursoId,
        valor: data.valor,
        valorOriginal: data.valor,
        quantidadeParcelas: data.quantidadeParcelas,
        status: data.status,
        dataPagamento: data.dataPagamento,
        dataVencimento: data.dataVencimento,
      },
    });
  }

  async darBaixaPagamento(financeiroId: number, valorPago: number, desconto: number, formaPagamento: string) {
    const financeiro = await prisma.financeiro.findUnique({
      where: { id: financeiroId },
    });

    if (!financeiro) {
      throw new Error('Registro financeiro não encontrado.');
    }

    if (financeiro.status === StatusFinanceiro.pago) {
      throw new Error('Pagamento já realizado para esta parcela.');
    }

    const valorFinal = valorPago - desconto;

    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        status: StatusFinanceiro.pago, // Enum usado aqui
        valorPago: valorFinal,
        desconto,
        dataPagamento: new Date(),
        formaPagamento,
      },
    });
  }

  async estornarPagamento(financeiroId: number) {
    const financeiro = await prisma.financeiro.findUnique({
      where: { id: financeiroId },
    });

    if (!financeiro) {
      throw new Error('Registro financeiro não encontrado.');
    }

    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        valor: financeiro.valorOriginal || 0,
        valorPago: 0,
        desconto: 0,
        status: StatusFinanceiro.pendente, // Enum usado aqui
        dataPagamento: null,
        formaPagamento: null,
      },
    });
  }

  async findAll(status?: StatusFinanceiro) {
    return prisma.financeiro.findMany({
      where: status ? { status } : {}, // Enum usado aqui
    });
  }

  async updateStatus(financeiroId: number, status: StatusFinanceiro) {
    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: { status }, // Enum usado aqui
    });
  }

  async atualizarStatusDevedor() {
    const parcelasVencidas = await prisma.financeiro.findMany({
      where: {
        status: StatusFinanceiro.pendente,
        dataVencimento: { lt: new Date() },
      },
    });

    const resultados = await Promise.all(
      parcelasVencidas.map((parcela) =>
        prisma.financeiro.update({
          where: { id: parcela.id },
          data: { status: StatusFinanceiro.devendo }, // Enum usado aqui
        })
      )
    );

    return resultados;
  }

  async delete(financeiroId: number) {
    return prisma.financeiro.delete({
      where: { id: financeiroId },
    });
  }

  async updateStatusToDevendo() {
    const hoje = new Date();

    try {
      // Atualizar todas as parcelas que estão vencidas e ainda estão com o status "pendente" para "devendo"
      const result = await prisma.financeiro.updateMany({
        where: {
          status: 'pendente', // Apenas parcelas pendentes
          dataVencimento: {
            lte: hoje, // Data de vencimento menor ou igual a hoje
          },
        },
        data: {
          status: 'devendo', // Atualiza o status para "devendo"
        },
      });

      console.log(`Status atualizado para "devendo" em ${result.count} registros.`);
    } catch (error) {
      console.error('Erro ao atualizar status para "devendo":', error);
      throw new Error('Erro ao atualizar status para "devendo".');
    }
  }
}
