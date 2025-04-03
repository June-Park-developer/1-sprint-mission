import { prismaClient } from '../lib/prismaClient';
import { Article, GetArticleListParamsInput } from '../typings/articleTypes';
import { Prisma } from '@prisma/client';

async function create(data: Prisma.ArticleUncheckedCreateInput) {
  return await prismaClient.article.create({ data });
}

async function getById(id: number): Promise<Article | null> {
  return await prismaClient.article.findUnique({ where: { id } });
}

async function update(id: number, data: Prisma.ArticleUpdateInput) {
  return await prismaClient.article.update({ where: { id }, data });
}

async function deleteById(id: number) {
  return await prismaClient.article.delete({ where: { id } });
}

async function countByKeyword(keyword?: string) {
  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  return await prismaClient.article.count({ where });
}

async function getArticleList(params: GetArticleListParamsInput) {
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

export default {
  create,
  getById,
  update,
  deleteById,
  countByKeyword,
  getArticleList,
};
