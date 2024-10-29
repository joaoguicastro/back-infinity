import { prisma } from '../lib/prisma';

export class FinanceiroRepository {
  async create(data: { alunoId: number; cursoId: number; valor: number; quantidadeParcelas: number; status: string; dataPagamento?: Date; dataVencimento: Date }) {
    return prisma.financeiro.create({
      data: {
        alunoId: data.alunoId,
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

  async darBaixaPagamento(financeiroId: number, valorPago: number, desconto: number) {
    const financeiro = await prisma.financeiro.findUnique({
      where: { id: financeiroId },
    });

    if (!financeiro) {
      throw new Error('Registro financeiro não encontrado.');
    }

    const valorComDesconto = financeiro.valor - desconto;
    const valorRestante = valorComDesconto - valorPago;

    const status = valorRestante <= 0 ? 'pago' : 'pendente';

    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        valorPago: valorPago,          
        desconto: desconto,           
        valor: valorRestante > 0 ? valorRestante : 0, 
        status: status,         
        dataPagamento: new Date(),  
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
        status: 'pendente',             
        dataPagamento: null,         
      },
    });
  }

  async findByAlunoId(alunoId: number) {
    return prisma.financeiro.findMany({
      where: { alunoId },
    });
  }

  async findAll() {
    return prisma.financeiro.findMany();
  }

  async updateStatus(financeiroId: number, status: string) {
    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: { status },
    });
  }

  async delete(financeiroId: number) {
    return prisma.financeiro.delete({
      where: { id: financeiroId },
    });
  }
}
