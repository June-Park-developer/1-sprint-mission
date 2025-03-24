import { prismaClient } from '../lib/prismaClient.js';

async function getById(id) {
  return await prismaClient.comment.findUnique({ where: { id } });
}

async function create(data) {
  return await prismaClient.comment.create({ data });
}

async function getCommentsWithCursor(articleId, limit, cursor) {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

async function update(id, data) {
  return await prismaClient.comment.update({ where: { id }, data: { content } });
}

async function deleteById(id) {
  return await prismaClient.comment.delete({ where: { id } });
}

export default {
  getById,
  create,
  getCommentsWithCursor,
  update,
  deleteById,
};
