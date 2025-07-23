/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt";
