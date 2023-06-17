-- CreateTable
CREATE TABLE "UserAuthData" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "activationKey" TEXT NOT NULL,
    "activationKeyCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuthData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "surname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthData_email_key" ON "UserAuthData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthData_activationKey_key" ON "UserAuthData"("activationKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthData_userProfileId_key" ON "UserAuthData"("userProfileId");

-- AddForeignKey
ALTER TABLE "UserAuthData" ADD CONSTRAINT "UserAuthData_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
