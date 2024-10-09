import { AlunoRepository } from '../repositories/alunoRepository';

const alunoRepository = new AlunoRepository();

export async function updateAluno(alunoId: number, data: { nome?: string; cpf?: string; nomeResponsavel?: string; dataNascimento?: Date; endereco?: string; telefone?: string }) {
  // Chama o método de update do repositório para atualizar o aluno com base no ID fornecido
  return alunoRepository.update(alunoId, data);
}
