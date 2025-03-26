import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
  likeArticle,
  unlikeArticle,
} from '../controllers/articlesController.js';
import { verifyAccessToken } from '../middlewares/verifyToken.js';
import { verifyArticleAuth } from '../middlewares/verifyAuth.js';
const articlesRouter = express.Router();

articlesRouter.post('/', verifyAccessToken, withAsync(createArticle));
articlesRouter.get('/', withAsync(getArticleList));
articlesRouter.get('/:id', withAsync(getArticle));
articlesRouter.patch(
  '/:id',
  verifyAccessToken,
  withAsync(verifyArticleAuth),
  withAsync(updateArticle),
);
articlesRouter.delete(
  '/:id',
  verifyAccessToken,
  withAsync(verifyArticleAuth),
  withAsync(deleteArticle),
);
articlesRouter.post('/:id/comments', verifyAccessToken, withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

articlesRouter.post(`/:id/like`, verifyAccessToken, withAsync(likeArticle));
articlesRouter.post(`/:id/unlike`, verifyAccessToken, withAsync(unlikeArticle));

export default articlesRouter;
