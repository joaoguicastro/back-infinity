import { prisma } from '../lib/prisma';

export class FinanceiroRepository {
  // Criar um novo registro financeiro
  async create(data: { alunoId: number; cursoId: number; valor: number; quantidadeParcelas: number; status: string; dataPagamento?: Date; dataVencimento: Date }) {
    return prisma.financeiro.create({
      data: {
        alunoId: data.alunoId,
        cursoId: data.cursoId,
        valor: data.valor,                // Valor atualizado após pagamento/desconto
        valorOriginal: data.valor,        // Armazenar o valor original da parcela
        quantidadeParcelas: data.quantidadeParcelas, // Incluindo o número de parcelas
        status: data.status,
        dataPagamento: data.dataPagamento,
        dataVencimento: data.dataVencimento, // Adicionando o campo de vencimento
      },
    });
  }

  // Dar baixa no pagamento de uma parcela específica, agora considerando valorPago e desconto
  async darBaixaPagamento(financeiroId: number, valorPago: number, desconto: number) {
    // Buscar o registro financeiro atual
    const financeiro = await prisma.financeiro.findUnique({
      where: { id: financeiroId },
    });

    if (!financeiro) {
      throw new Error('Registro financeiro não encontrado.');
    }

    // Calcular o valor final da parcela após desconto
    const valorComDesconto = financeiro.valor - desconto;
    const valorRestante = valorComDesconto - valorPago;

    // Verificar se o valor pago quita a parcela ou se ainda resta saldo
    const status = valorRestante <= 0 ? 'pago' : 'pendente';

    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        valorPago: valorPago,          // Atualiza o valor pago
        desconto: desconto,            // Atualiza o desconto
        valor: valorRestante > 0 ? valorRestante : 0, // Atualiza o valor restante (se houver)
        status: status,                // Atualiza o status
        dataPagamento: new Date(),     // Define a data de pagamento como a data atual
      },
    });
  }

  // Estornar o pagamento de uma parcela
  async estornarPagamento(financeiroId: number) {
    // Buscar o registro financeiro atual
    const financeiro = await prisma.financeiro.findUnique({
      where: { id: financeiroId },
    });

    if (!financeiro) {
      throw new Error('Registro financeiro não encontrado.');
    }

    // Restaurar o valor da parcela ao valor original
    return prisma.financeiro.update({
      where: { id: financeiroId },
      data: {
        valor: financeiro.valorOriginal || 0,  // Restaurar o valor original da parcela
        valorPago: 0,                     // Zera o valor pago
        desconto: 0,                      // Remove o desconto
        status: 'pendente',               // Volta para o status pendente
        dataPagamento: null,              // Remove a data de pagamento
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
