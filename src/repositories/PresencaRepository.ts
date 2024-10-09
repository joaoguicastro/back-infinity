import { prisma } from '../lib/prisma';

export class PresencaRepository {
  // Criar um novo registro de presença
  async create(data: { alunoId: number; cursoId: number; data: Date; presente: boolean; observacao?: string }) {
    return prisma.presenca.create({
      data,
    });
  }

  // Buscar todas as presenças de um aluno
  async findByAlunoId(alunoId: number) {
    return prisma.presenca.findMany({
      where: { alunoId },
    });
  }

  // Buscar todas as presenças de um curso
  async findByCursoId(cursoId: number) {
    return prisma.presenca.findMany({
      where: { cursoId },
    });
  }

  // Buscar presença por ID
  async findById(presencaId: number) {
    return prisma.presenca.findUnique({
      where: { id: presencaId },
    });
  }

  // Deletar um registro de presença
  async delete(presencaId: number) {
    return prisma.presenca.delete({
      where: { id: presencaId },
    });
  }
}
