import { prismaClient } from '../lib/prismaClient';
import { CreateCommentInput } from '../typings/commentTypes';
import { Prisma } from '@prisma/client';

async function getById(id: number) {
  return await prismaClient.comment.findUnique({ where: { id } });
}

async function create(data: CreateCommentInput) {
  return await prismaClient.comment.create({ data });
}

async function getCommentsForArticle(articleId: number, limit: number = 10, cursor?: number) {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

async function getCommentsForProduct(productId: number, limit: number = 10, cursor?: number) {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

async function update(id: number, content?: string) {
  return await prismaClient.comment.update({ where: { id }, data: { content } });
}

async function deleteById(id: number) {
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
