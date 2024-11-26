/*
  Warnings:

  - Changed the type of `status` on the `Financeiro` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusFinanceiro" AS ENUM ('pendente', 'pago', 'devendo');

-- AlterTable
ALTER TABLE "Financeiro" DROP COLUMN "status",
ADD COLUMN     "status" "StatusFinanceiro" NOT NULL;