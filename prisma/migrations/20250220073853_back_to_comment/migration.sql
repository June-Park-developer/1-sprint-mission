/*
  Warnings:

  - You are about to drop the `ArticleComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_articleId_fkey";

-- AlterTable
ALTER TABLE "ProductComment" ADD COLUMN     "articleId" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- DropTable
DROP TABLE "ArticleComment";

-- AddForeignKey
ALTER TABLE "ProductComment" ADD CONSTRAINT "ProductComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
