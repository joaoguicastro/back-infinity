import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function getFinancialReport() {
  return financeiroRepository.findAll();
}
