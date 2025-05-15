import { NotificationType as NotiType, Prisma } from '@prisma/client';
//Entity

export interface NotificationType {
  id: number;
  userId: number;
  type: NotiType;
  isRead: Boolean;
  payload: Prisma.JsonValue;
  createdAt: Date;
}
