/*
  Warnings:

  - You are about to drop the column `faculty` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Student` table. All the data in the column will be lost.
  - Added the required column `facultyId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "faculty",
DROP COLUMN "program",
DROP COLUMN "status",
ADD COLUMN     "facultyId" INTEGER NOT NULL,
ADD COLUMN     "programId" INTEGER NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "StudentStatus";

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StudentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudentStatus_name_key" ON "StudentStatus"("name");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StudentStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
