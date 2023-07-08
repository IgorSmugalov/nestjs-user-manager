-- AlterTable
ALTER TABLE "User" ADD COLUMN     "restorePasswordKey" TEXT,
ADD COLUMN     "restorePasswordKeyCreated" TIMESTAMP(3);
