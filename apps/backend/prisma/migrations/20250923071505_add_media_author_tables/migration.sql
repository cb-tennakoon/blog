/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(0),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "media_id" SERIAL NOT NULL,
    "uploaded_by" INTEGER NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "alt_text" VARCHAR(255),
    "caption" TEXT,
    "uploaded_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "public"."author" (
    "author_id" SERIAL NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "profile_image" VARCHAR(255),
    "bio" TEXT,
    "b" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "author_pkey" PRIMARY KEY ("author_id")
);

-- CreateTable
CREATE TABLE "public"."post" (
    "post_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "featured_image" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(0),
    "scheduled_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "allow_comments" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "post_pkey" PRIMARY KEY ("post_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "public"."user"("username");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "public"."user"("created_at");

-- CreateIndex
CREATE INDEX "media_uploaded_by_idx" ON "public"."media"("uploaded_by");

-- CreateIndex
CREATE INDEX "media_file_type_idx" ON "public"."media"("file_type");

-- CreateIndex
CREATE INDEX "media_uploaded_at_idx" ON "public"."media"("uploaded_at");

-- CreateIndex
CREATE UNIQUE INDEX "author_email_key" ON "public"."author"("email");

-- CreateIndex
CREATE UNIQUE INDEX "author_username_key" ON "public"."author"("username");

-- CreateIndex
CREATE INDEX "author_email_idx" ON "public"."author"("email");

-- CreateIndex
CREATE INDEX "author_username_idx" ON "public"."author"("username");

-- CreateIndex
CREATE INDEX "author_created_at_idx" ON "public"."author"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "post_slug_key" ON "public"."post"("slug");

-- CreateIndex
CREATE INDEX "post_status_idx" ON "public"."post"("status");

-- CreateIndex
CREATE INDEX "post_published_at_idx" ON "public"."post"("published_at");

-- CreateIndex
CREATE INDEX "post_slug_idx" ON "public"."post"("slug");

-- CreateIndex
CREATE INDEX "post_created_at_idx" ON "public"."post"("created_at");

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
