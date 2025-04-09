import { prismaClient } from '../lib/prismaClient';
import { CreateCommentInput, Comment } from '../typings/commentTypes';

export async function getById(id: number): Promise<Comment | null> {
  return await prismaClient.comment.findUnique({ where: { id } });
}

export async function create(data: CreateCommentInput): Promise<Comment> {
  return await prismaClient.comment.create({ data });
}

export async function getCommentsForArticle(
  articleId: number,
  limit: number = 10,
  cursor?: number,
): Promise<Comment[]> {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCommentsForProduct(
  productId: number,
  limit: number = 10,
  cursor?: number,
): Promise<Comment[]> {
  return await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function update(id: number, content?: string): Promise<Comment> {
  return await prismaClient.comment.update({ where: { id }, data: { content } });
}

export async function deleteById(id: number): Promise<Comment> {
  return await prismaClient.comment.delete({ where: { id } });
}
