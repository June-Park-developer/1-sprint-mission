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

export default {
  getById,
  create,
  getCommentsWithCursor,
};
