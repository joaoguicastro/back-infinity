import { PresencaRepository } from '../repositories/PresencaRepository';

const presencaRepository = new PresencaRepository();

export async function registrarPresenca(data: { alunoId: number; cursoId: number; data: Date; presente: boolean; observacao?: string }) {
  return presencaRepository.create(data);
}

// Você pode criar mais funções conforme necessário (por exemplo, para listar presenças).
