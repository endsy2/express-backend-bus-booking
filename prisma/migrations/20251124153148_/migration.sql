/*
  Warnings:

  - You are about to drop the column `price` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "price",
DROP COLUMN "status";
