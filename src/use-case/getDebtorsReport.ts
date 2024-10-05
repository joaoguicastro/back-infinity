import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

export async function getDebtorsReport() {
  return financeiroRepository.findAll().then(financeiros => 
    financeiros.filter(financeiro => financeiro.status !== 'pago')
  );
}
