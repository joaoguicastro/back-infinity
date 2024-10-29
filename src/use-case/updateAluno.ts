import { AlunoRepository } from '../repositories/alunoRepository';

const alunoRepository = new AlunoRepository();

export async function updateAluno(alunoId: number, data: { nome?: string; cpf?: string; nomeResponsavel?: string; dataNascimento?: Date; endereco?: string; telefone?: string }) {
  return alunoRepository.update(alunoId, data);
}
