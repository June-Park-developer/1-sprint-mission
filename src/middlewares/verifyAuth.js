import articlesRepository from '../repositories/articlesRepository.js';
import productsRepository from '../repositories/productsRepository.js';
import commentsRepository from '../repositories/commentsRepository.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { withAsync } from '../lib/withAsync.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { create } from 'superstruct';

export const verifyArticleAuth = async (req, res, next) => {
  const { userId } = req.user;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }
  if (article.authorId !== userId) {
    throw new ForbiddenError('Forbidden Access');
  }
  return next();
};

export const verifyProductAuth = withAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { id: productId } = create(req.params, IdParamsStruct);
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError('product', productId);
  }
  if (userId !== product.authorId) {
    throw new ForbiddenError('Forbidden Access');
  }
  return next();
});

export const verifyCommentAuth = withAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { id: commentId } = create(req.params, IdParamsStruct);
  const comment = await commentsRepository.getById(commentId);
  if (!comment) {
    throw new NotFoundError('comment', commentId);
  }
  if (userId !== comment.authorId) {
    throw new ForbiddenError('Forbidden Access');
  }
  return next();
});
