import { prisma } from '../lib/prisma';

export class AlunoRepository {
  // Criar um novo aluno
  async create(data: { nome: string; cpf: string; nomeResponsavel: string; dataNascimento: Date; endereco: string }) {
    return prisma.aluno.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        nomeResponsavel: data.nomeResponsavel,
        dataNascimento: data.dataNascimento, // Certifique-se de que isso seja um objeto `Date`
        endereco: data.endereco,
      },
    });
  }

  // Buscar aluno por ID
  async findById(alunoId: number) {
    return prisma.aluno.findUnique({
      where: { id: alunoId },
    });
  }

  // Buscar aluno por CPF
  async findByCpf(cpf: string) {
    return prisma.aluno.findUnique({
      where: { cpf },
    });
  }

  // Buscar todos os alunos
  async findAll() {
    return prisma.aluno.findMany();
  }

  // Atualizar um aluno
  async update(alunoId: number, data: { nome?: string; cpf?: string; nomeResponsavel?: string; dataNascimento?: Date; endereco?: string }) {
    return prisma.aluno.update({
      where: { id: alunoId },
      data,
    });
  }

  // Deletar um aluno
  async delete(alunoId: number) {
    return prisma.aluno.delete({
      where: { id: alunoId },
    });
  }
}
