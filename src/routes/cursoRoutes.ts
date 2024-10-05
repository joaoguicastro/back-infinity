import { FastifyInstance } from 'fastify';
import { verificarToken } from '../middleware/auth';
import { createCourse } from '../use-case/createCourse';
import { getCourseReport } from '../use-case/getCourseReport';

interface CreateCourseInput {
  nome: string;
  disciplinas: string[];
  cargaHoraria: number;
}

export async function cursoRoutes(server: FastifyInstance) {
  server.post<{ Body: CreateCourseInput }>('/cursos', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const novoCurso = await createCourse(request.body);
      reply.status(201).send(novoCurso);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.get('/relatorios/cursos', { preHandler: [verificarToken] }, async (request, reply) => {
    try {
      const cursos = await getCourseReport();
      reply.status(200).send(cursos);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
}
