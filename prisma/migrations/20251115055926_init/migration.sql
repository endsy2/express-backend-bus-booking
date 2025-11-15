/*
  Warnings:

  - You are about to drop the column `colNumber` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `rowNumber` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "colNumber",
DROP COLUMN "rowNumber";
