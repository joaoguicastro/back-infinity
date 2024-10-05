import { CursoRepository } from '../repositories/cursoRepository';

const cursoRepository = new CursoRepository();

export async function getCourseReport() {
  return cursoRepository.findAll();
}
