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
  diasDaSemana: string[]; // Novo campo
  horasPorDia: number; // Novo campo
}

export async function cursoRoutes(server: FastifyInstance) {
  // Rota para criar um curso - Apenas "master" ou "admin" têm acesso
  server.post<{ Body: CreateCourseInput }>('/cursos', { 
    preHandler: [verificarToken, verificarPermissao(['master', 'admin'])] 
  }, async (request, reply) => {
    try {
      const { nome, disciplinas, cargaHoraria, diasDaSemana, horasPorDia } = request.body;
      
      // Chama o use case de criação de curso com os novos campos
      const novoCurso = await createCourse({
        nome,
        disciplinas,
        cargaHoraria,
        diasDaSemana, // Incluindo o novo campo
        horasPorDia, // Incluindo o novo campo
      });
      
      reply.status(201).send(novoCurso);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Rota para listar relatórios de cursos - Todos os cargos podem acessar
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

  // Rota para buscar curso por ID - Todos os cargos podem acessar
  server.get('/cursos/:id', { 
    preHandler: [verificarToken] 
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const curso = await prisma.curso.findUnique({
        where: { id: Number(id) },
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
