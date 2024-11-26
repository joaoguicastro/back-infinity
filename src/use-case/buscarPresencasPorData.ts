import { PresencaRepository } from '../repositories/PresencaRepository';

const presencaRepository = new PresencaRepository();

export async function buscarPresencasPorData(data: string) {
  // Validação da data
  if (!data) {
    throw new Error('Data é obrigatória.');
  }

  const parsedDate = Date.parse(data);
  if (isNaN(parsedDate)) {
    throw new Error('Formato de data inválido. Use o formato YYYY-MM-DD.');
  }

  // Define o intervalo de data
  const inicioDoDia = new Date(data + 'T00:00:00.000Z');
  const fimDoDia = new Date(data + 'T23:59:59.999Z');

  // Busca presenças no intervalo de datas
  return await presencaRepository.findByDateRange(inicioDoDia, fimDoDia);
}
