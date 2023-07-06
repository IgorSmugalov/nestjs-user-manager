-- AlterTable
ALTER TABLE "User" ALTER COLUMN "activationKey" DROP NOT NULL,
ALTER COLUMN "activationKeyCreated" DROP NOT NULL;
