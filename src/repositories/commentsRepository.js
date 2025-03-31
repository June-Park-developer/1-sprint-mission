import { prismaClient } from '../lib/prismaClient';

async function getById(id) {
  return await prismaClient.comment.findUnique({ where: { id } });
}

async function create(data) {
  return await prismaClient.comment.create({ data });
}

async function getCommentsForArticle(articleId, limit, cursor) {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

async function getCommentsForProduct(productId, limit, cursor) {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

async function update(id, content) {
  return await prismaClient.comment.update({ where: { id }, data: { content } });
}

async function deleteById(id) {
  return await prismaClient.comment.delete({ where: { id } });
}

export default {
  getById,
  create,
  getCommentsForArticle,
  getCommentsForProduct,
  update,
  deleteById,
};
