import { Article } from '../typings/articleTypes';
import { Product } from '../typings/productTypes';
import { createAccessTokenWithUserId } from './auth/jwt';
import { prismaClient } from './prismaClient';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app';
import { User } from '../typings/userTypes';
import { Comment } from '../typings/commentTypes';
import http from 'http';
import { Server } from 'socket.io';
import Client, { Socket } from 'socket.io-client';
import { setupWebSocket } from '../websocket/setupWebSocket';

// Multiple 로 생성 시 id, index, createdAt 모두 같은 순서로 생성됩니다

// User 관련
export const createTestUser = async (index = 1): Promise<User> => {
  const plainPassword = 'password1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return prismaClient.user.create({
    data: {
      email: `testuser${index}@example.com`,
      nickname: `테스트유저${index}`,
      password: hashedPassword,
    },
  });
};

export const createMultipleTestUsers = async (count: number) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    const user = await createTestUser(i);
    users.push(user);
    await new Promise((r) => setTimeout(r, 1));
  }
  return users;
};

// Product 관련

export const createTestProduct = async (userId: number, index = 1): Promise<Product> => {
  return prismaClient.product.create({
    data: { name: `상품 ${index}`, description: `설명 ${index}`, authorId: userId, price: 1000 },
  });
};

export const createMultipleTestProducts = async (
  userId: number,
  count: number,
): Promise<Product[]> => {
  const products = [];

  for (let i = 1; i <= count; i++) {
    const product = await createTestProduct(userId, i);
    products.push(product);
    await new Promise((r) => setTimeout(r, 1));
  }

  return products;
};

export const likeProductByUser = async (userId: number, productId: number) => {
  console.log(`product를 라이크 하는 사람은 ${userId}`);
  return await prismaClient.likedProduct.create({
    data: { userId, productId },
  });
};

// Article 관련

export const createTestArticle = async (userId: number, index = 1): Promise<Article> => {
  return await prismaClient.article.create({
    data: {
      title: `게시글 ${index}`,
      content: `내용 ${index}`,
      authorId: userId,
      image: 'example.jpg',
    },
  });
};

export const createMultipleTestArticles = async (
  userId: number,
  count: number,
): Promise<Article[]> => {
  const articles = [];

  for (let i = 1; i <= count; i++) {
    const article = await createTestArticle(userId, i);
    articles.push(article);
    await new Promise((r) => setTimeout(r, 1));
  }

  return articles;
};

export const likeArticleByUser = async (userId: number, articleId: number) => {
  return await prismaClient.likedArticle.create({
    data: { userId, articleId },
  });
};

// Comment 관련
export const createTestProductComment = async (productId: number, authorId: number, index = 1) => {
  return await prismaClient.comment.create({
    data: {
      content: `댓글 ${index}`,
      authorId,
      productId,
    },
  });
};

export const createMultipleTestProductComments = async (
  productId: number,
  authorId: number,
  count: number,
): Promise<Comment[]> => {
  const comments = [];

  for (let i = 1; i <= count; i++) {
    comments.push(createTestProductComment(productId, authorId, i));
  }

  return await Promise.all(comments);
};

export const createTestArticleComment = async (articleId: number, authorId: number, index = 1) => {
  return await prismaClient.comment.create({
    data: {
      content: `댓글 ${index}`,
      authorId,
      articleId,
    },
  });
};

export const createMultipleTestArticleComments = async (
  articleId: number,
  authorId: number,
  count: number,
): Promise<Comment[]> => {
  const comments = [];

  for (let i = 1; i <= count; i++) {
    comments.push(createTestArticleComment(articleId, authorId, i));
  }

  return await Promise.all(comments);
};

// DB 전체 관련
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

export const getAuthenticatedAgent = (userId: number) => {
  const accessToken = createAccessTokenWithUserId(userId);
  const cookie = `accessToken=${accessToken}`;
  const agent = request.agent(app);
  agent.jar.setCookie(cookie);
  return agent;
};
