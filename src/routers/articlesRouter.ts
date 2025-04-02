import express from 'express';
import { withAsync } from '../lib/withAsync';
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
} from '../controllers/articlesController';
import { verifyAccessToken, optionalAccessToken } from '../middlewares/verifyToken';
import { verifyArticleAuth } from '../middlewares/verifyAuth';
const articlesRouter = express.Router();

articlesRouter.post('/', verifyAccessToken, withAsync(createArticle));
articlesRouter.get('/', optionalAccessToken, withAsync(getArticleList));

articlesRouter.get('/:id', optionalAccessToken, withAsync(getArticle));
articlesRouter.patch('/:id', verifyAccessToken, verifyArticleAuth, withAsync(updateArticle));
articlesRouter.delete('/:id', verifyAccessToken, verifyArticleAuth, withAsync(deleteArticle));

articlesRouter.post('/:id/comments', verifyAccessToken, withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

articlesRouter.post(`/:id/like`, verifyAccessToken, withAsync(likeArticle));
articlesRouter.post(`/:id/unlike`, verifyAccessToken, withAsync(unlikeArticle));

export default articlesRouter;
