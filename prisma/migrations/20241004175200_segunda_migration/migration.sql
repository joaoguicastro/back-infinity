-- CreateTable
CREATE TABLE "Financeiro" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "dataPagamento" TIMESTAMP(3),

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Financeiro" ADD CONSTRAINT "Financeiro_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
