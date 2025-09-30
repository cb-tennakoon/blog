/*
  Warnings:

  - You are about to drop the `TokenBlacklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."TokenBlacklist";

-- CreateTable
CREATE TABLE "public"."tokenBlacklist" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokenBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokenBlacklist_token_key" ON "public"."tokenBlacklist"("token");
