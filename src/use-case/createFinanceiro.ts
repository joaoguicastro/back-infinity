import { FinanceiroRepository } from '../repositories/financeiroRepository';
import { StatusFinanceiro } from '@prisma/client'; // Importe o enum gerado pelo Prisma

const financeiroRepository = new FinanceiroRepository();

export async function createFinanceiro(data: { 
  cursoId: number; 
  valor: number; 
  quantidadeParcelas: number; 
  status: string; // Validaremos antes de usar
  dataPagamento?: Date 
}) {
  // Validar o status para garantir que ele é do tipo StatusFinanceiro
  if (!Object.values(StatusFinanceiro).includes(data.status as StatusFinanceiro)) {
    throw new Error(`Status inválido: ${data.status}`);
  }

  const valorParcela = data.valor / data.quantidadeParcelas;
  const hoje = new Date();

  for (let i = 0; i < data.quantidadeParcelas; i++) {
    const dataVencimento = new Date(hoje);
    dataVencimento.setMonth(hoje.getMonth() + i);

    await financeiroRepository.create({
      cursoId: data.cursoId,
      valor: valorParcela, 
      quantidadeParcelas: data.quantidadeParcelas,
      status: data.status as StatusFinanceiro, // Converta para o enum
      dataPagamento: undefined, 
      dataVencimento, 
    });
  }

  return { message: 'Parcelamento criado com sucesso' };
}
