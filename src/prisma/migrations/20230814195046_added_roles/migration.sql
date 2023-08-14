-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('user', 'admin', 'superadmin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles"[] DEFAULT ARRAY['user']::"Roles"[];
