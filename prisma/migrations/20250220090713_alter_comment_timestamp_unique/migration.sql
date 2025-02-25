/*
  Warnings:

  - A unique constraint covering the columns `[timeStamp]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_timeStamp_key" ON "Comment"("timeStamp");
