import { FastifyInstance } from 'fastify';
import { verificarToken, verificarPermissao } from '../middleware/auth'; 
import { createCourse } from '../use-case/createCourse';
import { getCourseReport } from '../use-case/getCourseReport';
import { prisma } from '../lib/prisma';

// Adicione os novos campos na interface
interface CreateCourseInput {
  nome: string;
  disciplinas: string[];
  cargaHoraria: number;
  diasDaSemana: string[]; 
  horasPorDia: number;
}

export async function cursoRoutes(server: FastifyInstance) {
  server.post<{ Body: CreateCourseInput }>('/cursos', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    try {
      const { nome, disciplinas, cargaHoraria, diasDaSemana, horasPorDia } = request.body;
      
      const novoCurso = await createCourse({
        nome,
        disciplinas,
        cargaHoraria,
        diasDaSemana, 
        horasPorDia,
      });
      
      reply.status(201).send(novoCurso);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.get('/relatorios/cursos', { 
    preHandler: [verificarToken] 
  }, async (request, reply) => {
    try {
      const cursos = await getCourseReport();
      reply.status(200).send(cursos);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.get('/cursos/:id', { 
    preHandler: [verificarToken] 
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const curso = await prisma.curso.findUnique({
        where: { id: Number(id) },
        include: {
          alunos: true, // Inclui os alunos associados ao curso
        },
      });
  
      if (!curso) {
        return reply.status(404).send({ error: 'Curso não encontrado' });
      }
  
      reply.status(200).send(curso);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });
  
}
