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
  unlikeProduct,
} from '../controllers/productsController.js';
import { verifyAccessToken, optionalAccessToken } from '../middlewares/verifyToken.js';
import { verifyProductAuth } from '../middlewares/verifyAuth';
const productsRouter = express.Router();

productsRouter.post('/', verifyAccessToken, withAsync(createProduct));
productsRouter.get('/:id', optionalAccessToken, withAsync(getProduct));
productsRouter.patch(
  '/:id',
  verifyAccessToken,
  withAsync(verifyProductAuth),
  withAsync(updateProduct),
);
productsRouter.delete(
  '/:id',
  verifyAccessToken,
  withAsync(verifyProductAuth),
  withAsync(deleteProduct),
);
productsRouter.get('/', withAsync(getProductList));
productsRouter.post('/:id/comments', verifyAccessToken, withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));

productsRouter.post(`/:id/like`, verifyAccessToken, withAsync(likeProduct));
productsRouter.post(`/:id/unlike`, verifyAccessToken, withAsync(unlikeProduct));

export default productsRouter;
