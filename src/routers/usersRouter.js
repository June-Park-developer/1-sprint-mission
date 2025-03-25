import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createUser,
  loginUser,
  getMyInfo,
  patchMyInfo,
  patchMyPassword,
} from '../controllers/usersController.js';
import { getMyProductList } from '../controllers/productsController.js';
import { verifyAccessToken } from '../middlewares/verifyToken.js';

const usersRouter = express.Router();

usersRouter.post('/', withAsync(createUser));
usersRouter.post('/login', withAsync(loginUser));
usersRouter.get('/me', verifyAccessToken, withAsync(getMyInfo));
usersRouter.patch('/me', verifyAccessToken, withAsync(patchMyInfo));
usersRouter.patch('/me/password', verifyAccessToken, withAsync(patchMyPassword));
usersRouter.get('/me/products', verifyAccessToken, withAsync(getMyProductList));

export default usersRouter;
