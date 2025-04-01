import { prismaClient } from '../lib/prismaClient';
import {
  CreateArticleInput,
  GetArticleListParamsInput,
  UpdateArticleInput,
} from '../typings/articleTypes';
import { Prisma } from '@prisma/client';

async function create(data: Prisma.ArticleUncheckedCreateInput) {
  return await prismaClient.article.create({ data });
}

async function getById(id: number) {
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

async function getArticleList({ page, pageSize, orderBy, keyword }: GetArticleListParamsInput) {
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
