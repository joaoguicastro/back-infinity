import { prisma } from '../lib/prisma';
import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function darBaixaNoPagamento(id: number, desconto: number, valorPago: number) {
  const financeiro = await prisma.financeiro.findUnique({
    where: { id },
  });

  if (!financeiro) {
    throw new Error('Registro financeiro não encontrado.');
  }

  const valorComDesconto = financeiro.valor - desconto;
  const valorRestante = valorComDesconto - valorPago;


  const status = valorRestante <= 0 ? 'pago' : 'pendente';

  const financeiroAtualizado = await prisma.financeiro.update({
    where: { id },
    data: {
      valorPago: valorPago, 
      desconto: desconto,  
      valor: valorRestante > 0 ? valorRestante : 0, 
      status: status,      
      dataPagamento: new Date(), 
    },
  });

  return financeiroAtualizado;
}

export async function estornarPagamento(financeiroId: number) {
  const financeiro = await prisma.financeiro.findUnique({
    where: { id: financeiroId },
  });

  if (!financeiro) {
    throw new Error('Registro financeiro não encontrado.');
  }

  return prisma.financeiro.update({
    where: { id: financeiroId },
    data: {
      valor: financeiro.valorOriginal ?? financeiro.valor, 
      valorPago: 0, 
      desconto: 0, 
      status: 'pendente', 
      dataPagamento: null, 
    },
  });
}


