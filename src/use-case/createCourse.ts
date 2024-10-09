import { CursoRepository } from '../repositories/cursoRepository';

const cursoRepository = new CursoRepository();

export async function createCourse(data: { nome: string; disciplinas: string[]; cargaHoraria: number }) {
  // Aqui poderíamos adicionar validações extras, se necessário
  return cursoRepository.create(data);
}
