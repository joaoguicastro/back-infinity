import { prisma } from '../lib/prisma';

export class AlunoRepository {

  async create(data: { nome: string; cpf: string; nomeResponsavel: string; dataNascimento: Date; endereco: string; telefone: string }) {
    return prisma.aluno.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        nomeResponsavel: data.nomeResponsavel,
        dataNascimento: data.dataNascimento,
        endereco: data.endereco,
        telefone: data.telefone,
      },
    });
  }
  async findById(alunoId: number) {
    return prisma.aluno.findUnique({
      where: { id: alunoId },
    });
  }

  async findByCpf(cpf: string) {
    return prisma.aluno.findUnique({
      where: { cpf },
    });
  }

  async findAll() {
    return prisma.aluno.findMany();
  }

  async update(alunoId: number, data: { nome?: string; cpf?: string; nomeResponsavel?: string; dataNascimento?: Date; endereco?: string; telefone?: string }) {
    return prisma.aluno.update({
      where: { id: alunoId },
      data,
    });
  }

  async delete(alunoId: number) {
    return prisma.aluno.delete({
      where: { id: alunoId },
    });
  }
}
