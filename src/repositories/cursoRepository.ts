import { prisma } from '../lib/prisma';

export class CursoRepository {
  // Criar um novo curso com disciplinas
  async create(data: { nome: string; disciplinas: string[]; cargaHoraria: number }) {
    return prisma.curso.create({
      data: {
        nome: data.nome,
        cargaHoraria: data.cargaHoraria,
        disciplinas: data.disciplinas, // Aqui disciplinas continua sendo um array de strings
      },
    });
  }

  // Buscar curso por ID com alunos e financeiro
  async findById(cursoId: number) {
    return prisma.curso.findUnique({
      where: { id: cursoId },
      include: {
        alunos: true,      // Inclui os alunos relacionados ao curso
        financeiro: true,  // Inclui informações financeiras relacionadas ao curso
      },
    });
  }

  // Buscar todos os cursos
  async findAll() {
    return prisma.curso.findMany({
      include: {
        alunos: true,      // Inclui os alunos em todos os cursos
        financeiro: true,  // Inclui informações financeiras em todos os cursos
      },
    });
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
