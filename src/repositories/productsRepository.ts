import { prismaClient } from '../lib/prismaClient';
import {
  CreateProductInput,
  GetMyProductsParamsInput,
  GetProductListParamsInput,
  UpdateProductInput,
} from '../typings/productTypes';
import { Prisma } from '@prisma/client';

async function create(data: Prisma.ProductUncheckedCreateInput) {
  return await prismaClient.product.create({ data });
}

async function getById(id: number) {
  return await prismaClient.product.findUnique({ where: { id } });
}

async function update(id: number, data: Prisma.ProductUpdateInput) {
  return await prismaClient.product.update({
    where: { id },
    data,
  });
}

async function deleteById(id: number) {
  return await prismaClient.product.delete({
    where: { id },
  });
}

async function countByKeyword(keyword?: string) {
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;

  return await prismaClient.product.count({ where });
}

async function countByAuthorId(authorId: number) {
  const where = { authorId };

  return await prismaClient.product.count({ where });
}

async function getProductList({ page, pageSize, orderBy, keyword }: GetProductListParamsInput) {
  const where = {
    name: keyword ? { contains: keyword } : undefined,
  };
  return await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });
}

async function getMyProductList({ authorId, page, pageSize, orderBy }: GetMyProductsParamsInput) {
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

export default {
  create,
  getById,
  update,
  deleteById,
  countByKeyword,
  countByAuthorId,
  getProductList,
  getMyProductList,
};
