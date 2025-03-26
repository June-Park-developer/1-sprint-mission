import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createUser,
  loginUser,
  getMyInfo,
  patchMyInfo,
  patchMyPassword,
  refreshToken,
  getLikedProductList,
} from '../controllers/usersController.js';
import { getMyProductList } from '../controllers/productsController.js';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/verifyToken.js';

const usersRouter = express.Router();

usersRouter.post('/', withAsync(createUser));
usersRouter.post('/login', withAsync(loginUser));
usersRouter.get('/me', verifyAccessToken, withAsync(getMyInfo));
usersRouter.patch('/me', verifyAccessToken, withAsync(patchMyInfo));
usersRouter.patch('/me/password', verifyAccessToken, withAsync(patchMyPassword));
usersRouter.get('/me/products', verifyAccessToken, withAsync(getMyProductList));
usersRouter.post('/token/refresh', verifyRefreshToken, withAsync(refreshToken));
usersRouter.get('/liked-products', verifyAccessToken, withAsync(getLikedProductList));

export default usersRouter;
