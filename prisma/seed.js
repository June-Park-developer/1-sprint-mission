import { PrismaClient } from "@prisma/client";
import PRODUCTS from "./mock.js";

const prisma = new PrismaClient();

// 다 지워
async function main() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.comment.deleteMany();
  // 다 채워
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });
}

// 실행~
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
