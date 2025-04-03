import { prismaClient } from '../lib/prismaClient';

async function createLike(userId: number, articleId: number) {
  return await prismaClient.likedArticle.create({
    data: {
      userId,
      articleId,
    },
  });
}

async function deleteLike(userId: number, articleId: number) {
  return await prismaClient.likedArticle.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function getLike(userId: number, articleId: number) {
  return await prismaClient.likedArticle.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

export default { createLike, deleteLike, getLike };
