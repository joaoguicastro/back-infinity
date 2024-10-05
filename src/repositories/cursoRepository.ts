import { prisma } from '../lib/prisma';

export class CursoRepository {
  // Criar um novo curso
  async create(data: { nome: string; disciplinas: string[]; cargaHoraria: number }) {
    return prisma.curso.create({
      data,
    });
  }

  // Buscar curso por ID
  async findById(cursoId: number) {
    return prisma.curso.findUnique({
      where: { id: cursoId },
    });
  }

  // Buscar todos os cursos
  async findAll() {
    return prisma.curso.findMany();
  }

  // Atualizar um curso
  async update(cursoId: number, data: { nome?: string; disciplinas?: string[]; cargaHoraria?: number }) {
    return prisma.curso.update({
      where: { id: cursoId },
      data,
    });
  }

  // Deletar um curso
  async delete(cursoId: number) {
    return prisma.curso.delete({
      where: { id: cursoId },
    });
  }
}
