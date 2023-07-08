/*
  Warnings:

  - You are about to drop the column `restorePasswordKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `restorePasswordKeyCreated` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recoveryPasswordKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_restorePasswordKey_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "restorePasswordKey",
DROP COLUMN "restorePasswordKeyCreated",
ADD COLUMN     "recoveryPasswordKey" TEXT,
ADD COLUMN     "recoveryPasswordKeyCreated" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_recoveryPasswordKey_key" ON "User"("recoveryPasswordKey");
