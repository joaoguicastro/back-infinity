import { prisma } from '../lib/prisma';

async function getDebtorsReport() {
  try {
    // Buscar alunos com parcelas pendentes
    const alunos = await prisma.aluno.findMany({
      where: {
        cursoMatriculado: {
          financeiro: {
            some: { status: 'devendo' }, // Somente parcelas pendentes
          },
        },
      },
      include: {
        cursoMatriculado: {
          select: {
            nome: true,
            financeiro: {
              where: { status: 'devendo' }, // Apenas parcelas pendentes
              select: {
                valor: true,
                dataVencimento: true,
              },
            },
          },
        },
      },
    });

    // Processar os dados para o relatório
    const devedores = alunos.map(aluno => {
      const parcelasPendentes = aluno.cursoMatriculado?.financeiro || [];
      const valorTotalDevido = parcelasPendentes.reduce((acc, parcela) => acc + parcela.valor, 0);

      // Ordenar parcelas pelo vencimento
      const primeiraParcela = parcelasPendentes.sort((a, b) => {
        const dataA = a.dataVencimento ? new Date(a.dataVencimento).getTime() : Number.POSITIVE_INFINITY;
        const dataB = b.dataVencimento ? new Date(b.dataVencimento).getTime() : Number.POSITIVE_INFINITY;
        return dataA - dataB;
      })[0];

      const diasDesdeVencimento = primeiraParcela?.dataVencimento
        ? Math.floor((Date.now() - new Date(primeiraParcela.dataVencimento).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        nome: aluno.nome,
        telefone: aluno.telefone,
        curso: aluno.cursoMatriculado?.nome || 'N/A',
        valorDevido: valorTotalDevido,
        parcelasPendentes: parcelasPendentes.length,
        diasDesdeVencimento,
      };
    });

    return devedores;
  } catch (error) {
    console.error('Erro ao buscar devedores:', error);
    throw new Error('Erro ao gerar o relatório de devedores.');
  }
}

export { getDebtorsReport };
