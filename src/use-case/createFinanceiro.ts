import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function createFinanceiro(data: { cursoId: number; valor: number; quantidadeParcelas: number; status: string; dataPagamento?: Date }) {
  const valorParcela = data.valor / data.quantidadeParcelas;
  const hoje = new Date();

  for (let i = 0; i < data.quantidadeParcelas; i++) {
    const dataVencimento = new Date(hoje);
    dataVencimento.setMonth(hoje.getMonth() + i);

    await financeiroRepository.create({
      cursoId: data.cursoId,
      valor: valorParcela, 
      quantidadeParcelas: data.quantidadeParcelas,
      status: data.status,
      dataPagamento: undefined, 
      dataVencimento, 
    });
  }

  return { message: 'Parcelamento criado com sucesso' };
}
