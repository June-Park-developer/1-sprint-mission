import { prismaClient } from '../lib/prismaClient.js';

async function create(data) {
  return await prismaClient.product.create({ data });
}

async function getById(id) {
  return await prismaClient.product.findUnique({ where: { id } });
}

async function update(id, data) {
  return await prismaClient.product.update({
    where: { id },
    data,
  });
}

async function deleteById(id) {
  return await prismaClient.product.delete({
    where: { id },
  });
}

async function countByKeyword(keyword) {
  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;

  return await prismaClient.article.count({ where });
}

async function getProductList(page, pageSize, orderBy, keyword) {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
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
  getProductList,
};
