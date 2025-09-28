-- AlterTable
ALTER TABLE "public"."roles" ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" DOUBLE PRECISION NOT NULL DEFAULT 0;
