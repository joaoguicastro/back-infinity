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
      valor: valorParcela,  // Valor da parcela
      quantidadeParcelas: data.quantidadeParcelas,
      status: data.status,
      dataPagamento: undefined, // Nenhuma data de pagamento ainda
      dataVencimento, // Define a data de vencimento
    });
  }

  return { message: 'Parcelamento criado com sucesso' };
}
