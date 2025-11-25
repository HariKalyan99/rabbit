/*
  Warnings:

  - Added the required column `userId` to the `Wrokflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wrokflow" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Wrokflow" ADD CONSTRAINT "Wrokflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
