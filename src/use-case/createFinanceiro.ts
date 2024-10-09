import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function createFinanceiro(data: { alunoId: number; cursoId: number; valor: number; quantidadeParcelas: number; status: string; dataPagamento?: Date }) {
  const valorParcela = data.valor / data.quantidadeParcelas;

  const hoje = new Date();

  // Criar um registro financeiro para cada parcela
  for (let i = 0; i < data.quantidadeParcelas; i++) {
    // Definir data de vencimento para cada parcela (adicionando um mês para cada parcela)
    const dataVencimento = new Date(hoje);
    dataVencimento.setMonth(hoje.getMonth() + i); // Adiciona i meses para cada parcela

    await financeiroRepository.create({
      alunoId: data.alunoId,
      cursoId: data.cursoId,
      valor: valorParcela,
      quantidadeParcelas: data.quantidadeParcelas,
      status: data.status,
      dataPagamento: undefined,
      dataVencimento, // Definindo a data de vencimento de cada parcela
    });
  }

  return { message: 'Parcelamento criado com sucesso' };
}
