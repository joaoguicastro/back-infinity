/*
  Warnings:

  - You are about to drop the column `alunoId` on the `Financeiro` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Financeiro" DROP CONSTRAINT "Financeiro_alunoId_fkey";

-- AlterTable
ALTER TABLE "Financeiro" DROP COLUMN "alunoId";
