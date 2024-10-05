import { prisma } from '../lib/prisma';

export class FinanceiroRepository {
  // Criar um novo registro financeiro
  async create(data: { alunoId: number; cursoId: number; valor: number; status: string; dataPagamento?: Date }) {
    return prisma.financeiro.create({
      data,
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
