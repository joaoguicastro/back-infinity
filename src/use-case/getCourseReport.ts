import { CursoRepository } from '../repositories/cursoRepository';

const cursoRepository = new CursoRepository();

// Use case para obter todos os cursos
export async function getCourseReport() {
  return cursoRepository.findAll(); // Corrige para o método correto
}