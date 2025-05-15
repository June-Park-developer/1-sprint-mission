import { Notification, PayloadForCommentNoti } from '../typings/notificationTypes';

//Request
export interface createCommentNotiDTO {
  articleId: number;
  commentId: number;
  userId: number;
}
// Response
export type NotiListResponseDTO = Notification[];

export class UnreadNotiCountResponseDTO {
  unreadCount: number;
  constructor(count: number) {
    this.unreadCount = count;
  }
}
