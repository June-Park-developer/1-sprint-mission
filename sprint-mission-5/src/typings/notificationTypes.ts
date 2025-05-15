import { NotificationType, Prisma } from '@prisma/client';
//Entity

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  isRead: Boolean;
  payload: Prisma.JsonValue;
  createdAt: Date;
}

// Payload
export interface PayloadForCommentNoti {
  articleId: number;
  commentId: number;
}

// Input
export interface createCommentNotiInput {
  payload: PayloadForCommentNoti;
  userId: number;
  type: NotificationType;
}
