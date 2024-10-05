import { AlunoRepository } from '../repositories/alunoRepository';

const alunoRepository = new AlunoRepository();

export async function getStudentReport() {
  return alunoRepository.findAll();
}
