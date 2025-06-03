import { prismaClient } from '../lib/prismaClient';
import {
  GetMyProductsParamsInput,
  GetProductListParamsInput,
  Product,
} from '../typings/productTypes';
import { Prisma } from '@prisma/client';

export async function create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
  return await prismaClient.product.create({ data });
}

export async function getById(id: number): Promise<Product | null> {
  return await prismaClient.product.findUnique({ where: { id } });
}

export async function update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
  return await prismaClient.product.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: number): Promise<Product> {
  return await prismaClient.product.delete({
    where: { id },
  });
}

export async function countByKeyword(keyword?: string) {
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;

  return await prismaClient.product.count({ where });
}

export async function countByAuthorId(authorId: number) {
  const where = { authorId };

  return await prismaClient.product.count({ where });
}

export async function getProductList({
  page,
  pageSize,
  orderBy,
  keyword,
}: GetProductListParamsInput): Promise<Product[]> {
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : {};
  return await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });
}

export async function getMyProductList({
  authorId,
  page,
  pageSize,
  orderBy,
}: GetMyProductsParamsInput): Promise<Product[]> {
  const where = {
    authorId,
  };
  return await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });
}
