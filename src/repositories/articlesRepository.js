import { prismaClient } from '../lib/prismaClient.js';

async function create(data) {
  return await prismaClient.article.create({ data });
}

async function getById(id) {
  return await prismaClient.article.findUnique({ where: { id } });
}

async function update(id, data) {
  return await prismaClient.article.update({ where: { id }, data });
}

async function deleteById(id) {
  return await prismaClient.article.delete({ where: { id } });
}

async function countByKeyword(keyword) {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  return await prismaClient.article.count({ where });
}

async function getArticleList({ page, pageSize, orderBy, keyword }) {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };
  return await prismaClient.article.findMany({
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
  getArticleList,
};
