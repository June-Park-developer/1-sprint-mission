import { Request, Response } from 'express';
import * as notiService from '../services/notificationsService';

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const notifications = await notiService.getMyNotifications(userId);
  res.status(200).json(notifications);
};
