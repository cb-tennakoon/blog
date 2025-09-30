/*
  Warnings:

  - You are about to drop the column `b` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `author` table. All the data in the column will be lost.
  - You are about to drop the column `alt_text` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `allow_comments` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `scheduled_at` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `is_default` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `tokenBlacklist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author_id` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_uploaded_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_role_id_fkey";

-- DropIndex
DROP INDEX "public"."author_created_at_idx";

-- DropIndex
DROP INDEX "public"."media_file_type_idx";

-- DropIndex
DROP INDEX "public"."media_uploaded_at_idx";

-- DropIndex
DROP INDEX "public"."post_created_at_idx";

-- DropIndex
DROP INDEX "public"."post_published_at_idx";

-- AlterTable
ALTER TABLE "public"."author" DROP COLUMN "b",
DROP COLUMN "bio",
DROP COLUMN "is_active",
DROP COLUMN "profile_image",
DROP COLUMN "updated_at",
ADD COLUMN     "role_id" UUID;

-- AlterTable
ALTER TABLE "public"."media" DROP COLUMN "alt_text",
DROP COLUMN "caption",
DROP COLUMN "file_size";

-- AlterTable
ALTER TABLE "public"."post" DROP COLUMN "allow_comments",
DROP COLUMN "excerpt",
DROP COLUMN "featured_image",
DROP COLUMN "scheduled_at",
DROP COLUMN "updated_at",
DROP COLUMN "view_count",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."roles" DROP COLUMN "description",
DROP COLUMN "is_default",
DROP COLUMN "is_public",
DROP COLUMN "level",
DROP COLUMN "permissions";

-- DropTable
DROP TABLE "public"."tokenBlacklist";

-- DropTable
DROP TABLE "public"."user";

-- CreateTable
CREATE TABLE "public"."token_blacklist" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_blacklist_token_key" ON "public"."token_blacklist"("token");

-- CreateIndex
CREATE INDEX "post_author_id_idx" ON "public"."post"("author_id");

-- AddForeignKey
ALTER TABLE "public"."author" ADD CONSTRAINT "author_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."author"("author_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."author"("author_id") ON DELETE CASCADE ON UPDATE CASCADE;
