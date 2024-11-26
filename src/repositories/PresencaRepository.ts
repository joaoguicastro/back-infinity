import { prisma } from '../lib/prisma';

export class PresencaRepository {
  async create(data: { alunoId: number; cursoId: number; data: Date; presente: boolean; observacao?: string }) {
    return prisma.presenca.create({
      data,
    });
  }

  async findByAlunoId(alunoId: number) {
    return prisma.presenca.findMany({
      where: { alunoId },
    });
  }

  async findByCursoId(cursoId: number) {
    return prisma.presenca.findMany({
      where: { cursoId },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return prisma.presenca.findMany({
      where: {
        data: {
          gte: startDate, // Recebe a data de início já validada
          lte: endDate,   // Recebe a data de fim já validada
        },
      },
      include: {
        aluno: true, // Inclui informações do aluno
        curso: true, // Inclui informações do curso
      },
    });
  }
  

  async findById(presencaId: number) {
    return prisma.presenca.findUnique({
      where: { id: presencaId },
    });
  }

  async delete(presencaId: number) {
    return prisma.presenca.delete({
      where: { id: presencaId },
    });
  }
}
