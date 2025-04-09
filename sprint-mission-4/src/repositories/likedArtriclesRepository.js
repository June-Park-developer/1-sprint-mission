import { prismaClient } from '../lib/prismaClient.js';

async function createLike(userId, articleId) {
  return await prismaClient.likedArticle.create({
    data: {
      userId,
      articleId,
    },
  });
}

async function deleteLike(userId, articleId) {
  return await prismaClient.likedArticle.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

async function getLike(userId, articleId) {
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
