import { CreateArticleDTO } from '../DTO/articlesDTO';
import { CreateArticleCommentDTO, CreateProductCommentDTO } from '../DTO/commentsDTO';
import { CreateProductDTO } from '../DTO/productsDTO';
import { CreateUserDTO } from '../DTO/usersDTO';
import { Article } from '../typings/articleTypes';
import { Product } from '../typings/productTypes';
import { prismaClient } from './prismaClient';
import bcrypt from 'bcrypt';

export const createTestUser = async (data: CreateUserDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prismaClient.user.create({
    data: {
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
    },
  });
};

export const createTestProduct = async (data: CreateProductDTO): Promise<Product> => {
  return await prismaClient.product.create({
    data,
  });
};

export const createTestProductComment = async (data: CreateProductCommentDTO) => {
  await prismaClient.comment.create({
    data,
  });
};
export const createTestArticleComment = async (data: CreateArticleCommentDTO) => {
  await prismaClient.comment.create({
    data,
  });
};

export const clearTestDB = async () => {
  await prismaClient.comment.deleteMany();
  await prismaClient.product.deleteMany();
  await prismaClient.article.deleteMany();
  await prismaClient.user.deleteMany();
};

export const disconnectTestDB = async () => {
  await prismaClient.$disconnect();
};

export const createTestArticle = async (data: CreateArticleDTO): Promise<Article> => {
  return await prismaClient.article.create({
    data,
  });
};
