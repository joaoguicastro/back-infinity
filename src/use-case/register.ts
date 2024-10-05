import { AlunoRepository } from '../repositories/alunoRepository';

const alunoRepository = new AlunoRepository();

export async function registerAluno(data: { nome: string; cpf: string; nomeResponsavel: string; dataNascimento: string; endereco: string }) {
  // Convertendo `dataNascimento` para o tipo Date
  const parsedData = {
    ...data,
    dataNascimento: new Date(data.dataNascimento), // Converte a string para um objeto `Date`
  };

  return alunoRepository.create(parsedData);
}
