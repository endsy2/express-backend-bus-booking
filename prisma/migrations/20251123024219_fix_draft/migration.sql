/*
  Warnings:

  - You are about to drop the column `operatorName` on the `Bus` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalTime` on the `BusSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `BusSchedule` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `BusRoute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `BusRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bus" DROP COLUMN "operatorName";

-- AlterTable
ALTER TABLE "BusRoute" ADD COLUMN     "latitude" JSONB NOT NULL,
ADD COLUMN     "longitude" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "BusSchedule" DROP COLUMN "arrivalTime",
DROP COLUMN "departureTime",
ADD COLUMN     "departureDate" TIMESTAMP(3);
