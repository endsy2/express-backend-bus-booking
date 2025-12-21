/*
  Warnings:

  - You are about to drop the column `passengerName` on the `BookingSeat` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookingSeat" DROP COLUMN "passengerName";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "status";
