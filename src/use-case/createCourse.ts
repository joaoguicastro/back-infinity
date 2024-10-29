import { CursoRepository } from '../repositories/cursoRepository';

const cursoRepository = new CursoRepository();

export async function createCourse(data: { 
  nome: string; 
  disciplinas: string[]; 
  cargaHoraria: number; 
  diasDaSemana: string[];
  horasPorDia: number; 
}) {
  return cursoRepository.create(data);
}