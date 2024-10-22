/*
  Warnings:

  - You are about to drop the column `valorOriginal` on the `Financeiro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Financeiro" DROP COLUMN "valorOriginal",
ADD COLUMN     "desconto" DOUBLE PRECISION,
ADD COLUMN     "valorPago" DOUBLE PRECISION;
