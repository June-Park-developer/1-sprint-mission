/*
  Warnings:

  - You are about to drop the column `isReaqd` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "isReaqd",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;
