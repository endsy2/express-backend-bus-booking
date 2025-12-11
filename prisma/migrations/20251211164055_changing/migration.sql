/*
  Warnings:

  - You are about to drop the column `passengerAge` on the `BookingSeat` table. All the data in the column will be lost.
  - You are about to drop the column `passengerGender` on the `BookingSeat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookingSeat" DROP COLUMN "passengerAge",
DROP COLUMN "passengerGender";
