/*
  Warnings:

  - Made the column `UserId` on table `RefreshToken` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_UserId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "UserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
