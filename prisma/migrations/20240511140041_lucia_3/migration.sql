/*
  Warnings:

  - You are about to drop the `key` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "key" DROP CONSTRAINT "key_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "hashed_password" TEXT;

-- DropTable
DROP TABLE "key";
