import { prismaClient } from '../lib/prismaClient.js';

async function createLike(userId, productId) {
  return await prismaClient.likedProduct.create({
    data: {
      userId,
      productId,
    },
  });
}

async function deleteLike(userId, productId) {
  return await prismaClient.likedProduct.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function getLike(userId, productId) {
  return await prismaClient.likedProduct.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}
export default { createLike, deleteLike, getLike };
