import { CreateArticleDTO } from '../DTO/articlesDTO';
import { CreateArticleCommentDTO, CreateProductCommentDTO } from '../DTO/commentsDTO';
import { CreateProductDTO } from '../DTO/productsDTO';
import { CreateUserDTO } from '../DTO/usersDTO';
import { Article } from '../typings/articleTypes';
import { Product } from '../typings/productTypes';
import { createAccessTokenWithUserId } from './auth/jwt';
import { prismaClient } from './prismaClient';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app';

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
  await prismaClient.notification.deleteMany();
  await prismaClient.likedProduct.deleteMany();
  await prismaClient.likedArticle.deleteMany();
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

export const likeProductByUser = async (userId: number, productId: number) => {
  return await prismaClient.likedProduct.create({
    data: { userId, productId },
  });
};
export const likeArticleByUser = async (userId: number, articleId: number) => {
  return await prismaClient.likedArticle.create({
    data: { userId, articleId },
  });
};

export const getAuthenticatedAgent = (userId: number) => {
  const accessToken = createAccessTokenWithUserId(userId);
  const cookie = `accessToken=${accessToken}`;
  const agent = request.agent(app);
  agent.jar.setCookie(cookie);
  return agent;
};
