import { prisma } from '../lib/prisma';
import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

// Dar baixa no pagamento de uma parcela
export async function darBaixaNoPagamento(id: number, desconto: number, valorPago: number) {
  // Busca o registro financeiro da parcela
  const financeiro = await prisma.financeiro.findUnique({
    where: { id },
  });

  if (!financeiro) {
    throw new Error('Registro financeiro não encontrado.');
  }

  // Calcula o novo valor da parcela após o desconto e o pagamento parcial
  const valorComDesconto = financeiro.valor - desconto;
  const valorRestante = valorComDesconto - valorPago;

  // Verifica se o valor pago é suficiente para quitar a parcela
  const status = valorRestante <= 0 ? 'pago' : 'pendente';

  // Atualiza o registro financeiro no banco de dados
  const financeiroAtualizado = await prisma.financeiro.update({
    where: { id },
    data: {
      valorPago: valorPago, // Atualiza o valor pago
      desconto: desconto,   // Atualiza o desconto
      valor: valorRestante > 0 ? valorRestante : 0, // Atualiza o valor restante
      status: status,       // Atualiza o status da parcela
      dataPagamento: new Date(), // Registra a data de pagamento
    },
  });

  return financeiroAtualizado;
}

export async function estornarPagamento(financeiroId: number) {
  // Buscar o registro financeiro original
  const financeiro = await prisma.financeiro.findUnique({
    where: { id: financeiroId },
  });

  if (!financeiro) {
    throw new Error('Registro financeiro não encontrado.');
  }

  // Restaurar o valor da parcela ao valor original e remover o valor pago
  return prisma.financeiro.update({
    where: { id: financeiroId },
    data: {
      valor: financeiro.valorOriginal ?? financeiro.valor, // Restaura o valor original da parcela
      valorPago: 0, // Zera o valor pago
      desconto: 0, // Remove o desconto
      status: 'pendente', // Voltar para o status pendente
      dataPagamento: null, // Remove a data de pagamento
    },
  });
}


