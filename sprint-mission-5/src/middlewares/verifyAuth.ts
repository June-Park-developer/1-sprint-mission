import * as articlesRepository from '../repositories/articlesRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as commentsRepository from '../repositories/commentsRepository';
import { ForbiddenError } from '../lib/errors/ForbiddenError';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { withAsync } from '../lib/withAsync';
import { IdParamsStruct } from '../structs/commonStructs';
import { create } from 'superstruct';
import { RequestHandler } from 'express';

export const verifyArticleAuth: RequestHandler = withAsync(async (req, res, next) => {
  const userId = req.user?.userId;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  if (article.authorId !== userId) {
    throw new ForbiddenError('Forbidden Access');
  }
  return next();
});

export const verifyProductAuth: RequestHandler = withAsync(async (req, res, next) => {
  const userId = req.user?.userId;
  const { id: productId } = create(req.params, IdParamsStruct);
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  if (userId !== product.authorId) {
    throw new ForbiddenError('Forbidden Access');
  }
  return next();
});

export const verifyCommentAuth: RequestHandler = withAsync(async (req, res, next) => {
  const userId = req.user?.userId;
  const { id: commentId } = create(req.params, IdParamsStruct);
  const comment = await commentsRepository.getById(commentId);
  if (!comment) {
    throw new NotFoundError(`Comment with id ${commentId} is not found`);
  }
  if (userId !== comment.authorId) {
    throw new ForbiddenError('Forbidden Access');
  }
  return next();
});
