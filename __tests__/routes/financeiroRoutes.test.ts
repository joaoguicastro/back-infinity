import { buildServer } from '../../src/server'; // Função para construir o servidor
import supertest from 'supertest'; // Biblioteca para testes de API

describe('Testes das rotas de Curso', () => {
  const server = buildServer(); // Constrói o servidor para os testes
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhcmdvIjoibWFzdGVyIiwiaWF0IjoxNzMyNTY1MTIzLCJleHAiOjE3MzI2NTE1MjN9.SQOLKcB_oY8HbRbXcod4-t7PixNvz_hvSWb3nxCO8D8'; // Substitua por um token válido

  beforeAll(async () => {
    // Inicializa o servidor antes de executar os testes
    await server.ready();
  });

  afterAll(async () => {
    // Finaliza o servidor após todos os testes
    await server.close();
  });

  it('Deve criar um novo curso', async () => {
    const payload = {
      nome: 'Curso de Programação',
      disciplinas: ['Lógica de Programação', 'Introdução ao JavaScript'],
      cargaHoraria: 40, // Certifique-se de que esses valores sejam válidos
      diasDaSemana: ['segunda', 'quarta', 'sexta'],
      horasPorDia: 2,
    };

    const response = await supertest(server.server)
      .post('/cursos') // Endpoint para criar curso
      .set('Authorization', `Bearer ${token}`) // Inclui o token de autenticação
      .send(payload); // Envia os dados do curso

    // Verifica o status da resposta
    expect(response.status).toBe(201);
    // Verifica se a resposta contém o ID do curso criado
    expect(response.body).toHaveProperty('id');
    // Verifica se o nome do curso é o mesmo enviado no payload
    expect(response.body.nome).toBe(payload.nome);
    // Adiciona um log para depuração, se necessário
    console.log('Novo Curso Criado:', response.body);
  }, 15000); // Timeout aumentado para 15 segundos
});
