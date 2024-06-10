/*
  Warnings:

  - You are about to drop the column `active_expires` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `idle_expires` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `session` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropIndex
DROP INDEX "session_user_id_idx";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "active_expires",
DROP COLUMN "idle_expires",
DROP COLUMN "user_id",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
