/*
  Warnings:

  - You are about to drop the column `desconto` on the `Financeiro` table. All the data in the column will be lost.
  - You are about to drop the column `valorPago` on the `Financeiro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Financeiro" DROP COLUMN "desconto",
DROP COLUMN "valorPago",
ADD COLUMN     "valorOriginal" DOUBLE PRECISION;
