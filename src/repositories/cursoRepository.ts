import { prisma } from '../lib/prisma';

export class CursoRepository {
  async create(data: { nome: string; disciplinas: string[]; cargaHoraria: number; diasDaSemana: string[]; horasPorDia: number }) {
    return prisma.curso.create({
      data: {
        nome: data.nome,
        cargaHoraria: data.cargaHoraria,
        disciplinas: data.disciplinas,
        diasDaSemana: data.diasDaSemana, 
        horasPorDia: data.horasPorDia, 
      },
    });
  }

  async findById(cursoId: number) {
    return prisma.curso.findUnique({
      where: { id: cursoId },
      include: {
        alunos: true,     
        financeiro: true, 
      },
    });
  }

  async findAll() {
    return prisma.curso.findMany({
      include: {
        alunos: true,      
        financeiro: true, 
      },
    });
  }

  async update(cursoId: number, data: { nome?: string; disciplinas?: string[]; cargaHoraria?: number; diasDaSemana?: string[]; horasPorDia?: number }) {
    return prisma.curso.update({
      where: { id: cursoId },
      data,
    });
  }

  async delete(cursoId: number) {
    return prisma.curso.delete({
      where: { id: cursoId },
    });
  }
}
