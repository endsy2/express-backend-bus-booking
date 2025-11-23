/*
  Warnings:

  - You are about to drop the column `latitude` on the `BusRoute` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `BusRoute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusRoute" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "location" JSONB;
