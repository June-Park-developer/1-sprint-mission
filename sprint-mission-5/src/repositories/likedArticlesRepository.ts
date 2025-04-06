import { prismaClient } from '../lib/prismaClient';
import { LikedArticle } from '../typings/likedArticleTypes';

export async function createLike(userId: number, articleId: number): Promise<LikedArticle> {
  return await prismaClient.likedArticle.create({
    data: {
      userId,
      articleId,
    },
  });
}

export async function deleteLike(userId: number, articleId: number): Promise<LikedArticle> {
  return await prismaClient.likedArticle.delete({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}

export async function getLike(userId: number, articleId: number): Promise<LikedArticle | null> {
  return await prismaClient.likedArticle.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
}
