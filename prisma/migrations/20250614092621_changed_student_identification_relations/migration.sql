/*
  Warnings:

  - You are about to drop the column `studentId` on the `Identification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cccdId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cmndId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passportId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Identification" DROP CONSTRAINT "Identification_studentId_fkey";

-- AlterTable
ALTER TABLE "Identification" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "cccdId" INTEGER,
ADD COLUMN     "cmndId" INTEGER,
ADD COLUMN     "passportId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Student_cccdId_key" ON "Student"("cccdId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_cmndId_key" ON "Student"("cmndId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_passportId_key" ON "Student"("passportId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_cccdId_fkey" FOREIGN KEY ("cccdId") REFERENCES "Identification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_cmndId_fkey" FOREIGN KEY ("cmndId") REFERENCES "Identification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "Identification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
