import { FinanceiroRepository } from '../repositories/financeiroRepository';

const financeiroRepository = new FinanceiroRepository();

// Dar baixa no pagamento de uma parcela
export async function darBaixaNoPagamento(financeiroId: number) {
  // Atualizar o status da parcela para "pago"
  return await financeiroRepository.updateStatus(financeiroId, 'pago');
}

// Estornar o pagamento de uma parcela
export async function estornarPagamento(financeiroId: number) {
  // Atualizar o status da parcela para "pendente"
  return await financeiroRepository.updateStatus(financeiroId, 'pendente');
}
