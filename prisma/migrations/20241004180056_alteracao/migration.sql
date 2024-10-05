/*
  Warnings:

  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_alunoId_fkey";

-- AlterTable
ALTER TABLE "Financeiro" ADD COLUMN     "cursoId" INTEGER;

-- DropTable
DROP TABLE "Pagamento";

-- AddForeignKey
ALTER TABLE "Financeiro" ADD CONSTRAINT "Financeiro_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
