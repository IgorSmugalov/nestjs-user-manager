/*
  Warnings:

  - A unique constraint covering the columns `[restorePasswordKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_restorePasswordKey_key" ON "User"("restorePasswordKey");
