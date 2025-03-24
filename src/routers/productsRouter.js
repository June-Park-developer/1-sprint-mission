import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from '../controllers/productsController.js';
import { verifyAccessToken } from '../middlewares/verifyToken.js';
const productsRouter = express.Router();

productsRouter.post('/', verifyAccessToken, withAsync(createProduct));
productsRouter.get('/:id', withAsync(getProduct));
productsRouter.patch('/:id', withAsync(updateProduct));
productsRouter.delete('/:id', withAsync(deleteProduct));
productsRouter.get('/', withAsync(getProductList));
productsRouter.post('/:id/comments', verifyAccessToken, withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));

export default productsRouter;
