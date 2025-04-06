import { prismaClient } from '../lib/prismaClient';
import { Article, GetArticleListParamsInput } from '../typings/articleTypes';
import { Prisma } from '@prisma/client';

export async function create(data: Prisma.ArticleUncheckedCreateInput): Promise<Article> {
  return await prismaClient.article.create({ data });
}

export async function getById(id: number): Promise<Article | null> {
  return await prismaClient.article.findUnique({ where: { id } });
}

export async function update(id: number, data: Prisma.ArticleUpdateInput): Promise<Article> {
  return await prismaClient.article.update({ where: { id }, data });
}

export async function deleteById(id: number): Promise<Article> {
  return await prismaClient.article.delete({ where: { id } });
}

export async function countByKeyword(keyword?: string) {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  return await prismaClient.article.count({ where });
}

export async function getArticleList(params: GetArticleListParamsInput): Promise<Article[]> {
  const where = {
    title: params.keyword ? { contains: params.keyword } : undefined,
  };
  return await prismaClient.article.findMany({
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
    orderBy: params.orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });
}
