import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  likeProduct,
} from '../controllers/productsController';
import { verifyAccessToken, optionalAccessToken } from '../middlewares/verifyToken';
import { verifyProductAuth } from '../middlewares/verifyAuth';
export const productsRouter = express.Router();

productsRouter.post('/', verifyAccessToken, withAsync(createProduct));
productsRouter.get('/', optionalAccessToken, withAsync(getProductList));

productsRouter.get('/:id', optionalAccessToken, withAsync(getProduct));
productsRouter.patch('/:id', verifyAccessToken, verifyProductAuth, withAsync(updateProduct));
productsRouter.delete('/:id', verifyAccessToken, verifyProductAuth, withAsync(deleteProduct));

productsRouter.post('/:id/comments', verifyAccessToken, withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));

productsRouter.post(`/:id/like`, verifyAccessToken, withAsync(likeProduct));
