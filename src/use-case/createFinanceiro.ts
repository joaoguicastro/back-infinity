import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function createFinanceiro(data: { alunoId: number; cursoId: number; valor: number; status: string; dataPagamento?: Date }) {
  return financeiroRepository.create(data);
}
