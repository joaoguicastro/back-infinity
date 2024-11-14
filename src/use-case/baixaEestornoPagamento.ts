import { prisma } from '../lib/prisma';
import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function darBaixaNoPagamento(id: number, desconto: number = 0, valorPago: number) {
  const financeiro = await prisma.financeiro.findUnique({
    where: { id },
  });

  if (!financeiro) {
    throw new Error('Registro financeiro não encontrado.');
  }

  // Certifique-se de que o desconto não seja maior que o valor
  const descontoAplicado = desconto || 0;
  const valorComDesconto = Math.max(financeiro.valor - descontoAplicado, 0);
  const valorRestante = Math.max(valorComDesconto - valorPago, 0);

  const status = valorRestante <= 0 ? 'pago' : 'pendente';

  const financeiroAtualizado = await prisma.financeiro.update({
    where: { id },
    data: {
      valorPago: valorPago, 
      desconto: descontoAplicado,  
      valor: valorRestante > 0 ? valorRestante : 0, 
      status: status,      
      dataPagamento: new Date(), 
    },
  });

  return {
    id: financeiroAtualizado.id,
    status: financeiroAtualizado.status,
    dataPagamento: financeiroAtualizado.dataPagamento,
    valorPago: financeiroAtualizado.valorPago,
    desconto: financeiroAtualizado.desconto,
    valor: financeiroAtualizado.valor
  };
}

export async function estornarPagamento(financeiroId: number) {
  const financeiro = await prisma.financeiro.findUnique({
    where: { id: financeiroId },
  });

  if (!financeiro) {
    throw new Error('Registro financeiro não encontrado.');
  }

  const financeiroEstornado = await prisma.financeiro.update({
    where: { id: financeiroId },
    data: {
      valor: financeiro.valorOriginal ?? financeiro.valor, 
      valorPago: 0, 
      desconto: 0, 
      status: 'pendente', 
      dataPagamento: null, 
    },
  });

  return {
    id: financeiroEstornado.id,
    status: financeiroEstornado.status,
    valorPago: financeiroEstornado.valorPago,
    desconto: financeiroEstornado.desconto,
    valor: financeiroEstornado.valor,
    dataPagamento: financeiroEstornado.dataPagamento
  };
}
