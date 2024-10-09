import { CursoRepository } from '../repositories/cursoRepository';

const cursoRepository = new CursoRepository();

// Use case para criar um novo curso
export async function createCourse(data: { 
  nome: string; 
  disciplinas: string[]; 
  cargaHoraria: number; 
  diasDaSemana: string[]; // Novo campo
  horasPorDia: number; // Novo campo
}) {
  // Aqui poderíamos adicionar validações extras, se necessário
  return cursoRepository.create(data);
}