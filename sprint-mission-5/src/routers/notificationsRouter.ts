import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  getMyNotifications,
  getUnreadNotiCount,
  readMyNotification,
} from '../controllers/notificationsController';
import { verifyAccessToken } from '../middlewares/verifyToken';

export const notificationRouter = express.Router();

notificationRouter.get('/me', verifyAccessToken, withAsync(getMyNotifications));
notificationRouter.get('/me/unread-count', verifyAccessToken, withAsync(getUnreadNotiCount));
notificationRouter.patch('/:id', verifyAccessToken, withAsync(readMyNotification));
