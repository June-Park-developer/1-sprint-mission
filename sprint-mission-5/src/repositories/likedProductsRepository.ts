import { prismaClient } from '../lib/prismaClient';
import { LikedProduct, LikedProductListParamsInput } from '../typings/likedProductTypes';
import { Product } from '../typings/productTypes';

export async function createLike(userId: number, productId: number): Promise<LikedProduct> {
  return await prismaClient.likedProduct.create({
    data: {
      userId,
      productId,
    },
  });
}

export async function deleteLike(userId: number, productId: number): Promise<LikedProduct> {
  return await prismaClient.likedProduct.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function getLike(userId: number, productId: number): Promise<LikedProduct | null> {
  return await prismaClient.likedProduct.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function getLikedProductList({
  userId,
  page,
  pageSize,
  orderBy,
}: LikedProductListParamsInput): Promise<Product[]> {
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

export async function countByUserId(userId: number) {
  return await prismaClient.likedProduct.count({
    where: { userId },
  });
}
