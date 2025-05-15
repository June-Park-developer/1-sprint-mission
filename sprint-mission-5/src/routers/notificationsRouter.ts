import express from 'express';
import { withAsync } from '../lib/withAsync';
import { getMyNotifications } from '../controllers/notificationsController';
import { verifyAccessToken } from '../middlewares/verifyToken';

export const notificationRouter = express.Router();

notificationRouter.get('/me', verifyAccessToken, withAsync(getMyNotifications));
