import { prisma } from '../lib/prisma';

export class FinanceiroRepository {
  // Criar um novo registro financeiro
  async create(data: { alunoId: number; cursoId: number; valor: number; quantidadeParcelas: number; status: string; dataPagamento?: Date; dataVencimento: Date }) {
    return prisma.financeiro.create({
      data: {
        alunoId: data.alunoId,
        cursoId: data.cursoId,
        valor: data.valor,
        quantidadeParcelas: data.quantidadeParcelas, // Incluindo o número de parcelas
        status: data.status,
        dataPagamento: data.dataPagamento,
        dataVencimento: data.dataVencimento, // Adicionando o campo de vencimento
      },
    });
  }

  // Dar baixa no pagamento de uma parcela específica
  async darBaixaPagamento(financeiroId: number) {
    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        status: 'pago', // Atualiza o status para 'pago'
        dataPagamento: new Date(), // Define a data de pagamento como a data atual
      },
    });
  }

  // Estornar o pagamento de uma parcela
  async estornarPagamento(financeiroId: number) {
    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        status: 'pendente', // Atualiza o status de volta para 'pendente'
        dataPagamento: null, // Remove a data de pagamento
      },
    });
  }

  // Buscar registros financeiros por aluno ID
  async findByAlunoId(alunoId: number) {
    return prisma.financeiro.findMany({
      where: { alunoId },
    });
  }

  // Buscar todos os registros financeiros
  async findAll() {
    return prisma.financeiro.findMany();
  }

  // Atualizar o status do pagamento de um registro financeiro específico
  async updateStatus(financeiroId: number, status: string) {
    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: { status },
    });
  }

  // Deletar um registro financeiro específico
  async delete(financeiroId: number) {
    return prisma.financeiro.delete({
      where: { id: financeiroId },
    });
  }
}
