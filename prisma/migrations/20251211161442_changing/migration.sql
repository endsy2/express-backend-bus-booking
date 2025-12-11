/*
  Warnings:

  - You are about to drop the column `passengerIdNumber` on the `BookingSeat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookingSeat" DROP COLUMN "passengerIdNumber",
ADD COLUMN     "passengerNumber" TEXT;
