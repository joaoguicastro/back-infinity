import { AlunoRepository } from '../repositories/alunoRepository';

const alunoRepository = new AlunoRepository();

export async function registerAluno(data: { nome: string; cpf: string; nomeResponsavel: string; dataNascimento: string; endereco: string; telefone: string }) {
  const parsedData = {
    ...data,
    dataNascimento: new Date(data.dataNascimento),
  };

  return alunoRepository.create(parsedData);
}
