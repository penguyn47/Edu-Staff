/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - Added the required column `nationality` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('CMND', 'CCCD', 'PASSPORT');

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address",
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "permaAddressId" INTEGER,
ADD COLUMN     "tempAddressId" INTEGER,
ADD COLUMN     "zipCode" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identification" (
    "id" SERIAL NOT NULL,
    "type" "IdentificationType" NOT NULL,
    "number" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "issuePlace" TEXT NOT NULL,
    "hasChip" BOOLEAN,
    "issuingCountry" TEXT,
    "notes" TEXT,
    "studentId" INTEGER,

    CONSTRAINT "Identification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Identification_number_key" ON "Identification"("number");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_permaAddressId_fkey" FOREIGN KEY ("permaAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tempAddressId_fkey" FOREIGN KEY ("tempAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identification" ADD CONSTRAINT "Identification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
