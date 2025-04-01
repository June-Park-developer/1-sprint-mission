import { prismaClient } from '../lib/prismaClient';
import { LikedProductListParamsInput } from '../typings/likedProductTypes.';
import productsRepository from './productsRepository.js';

async function createLike(userId: number, productId: number) {
  return await prismaClient.likedProduct.create({
    data: {
      userId,
      productId,
    },
  });
}

async function deleteLike(userId: number, productId: number) {
  return await prismaClient.likedProduct.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function getLike(userId: number, productId: number) {
  return await prismaClient.likedProduct.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

async function getLikedProductList({
  userId,
  page,
  pageSize,
  orderBy,
}: LikedProductListParamsInput) {
  const likedProducts = await prismaClient.likedProduct.findMany({
    where: { userId },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : {},
    include: { product: true },
  });
  const products = likedProducts.map((likedProduct) => likedProduct.product);
  return products;
}

async function countByUserId(userId: number) {
  return await prismaClient.likedProduct.count({
    where: { userId },
  });
}

export default { createLike, deleteLike, getLike, getLikedProductList, countByUserId };
