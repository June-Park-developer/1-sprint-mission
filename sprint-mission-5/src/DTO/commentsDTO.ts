import { Comment } from '../typings/commentTypes';
import { EntityType } from '../typings/EnumTypes';

export interface CreateCommentDTO {
  entityName: EntityType;
  productId?: number;
  articleId?: number;
  content: string;
  authorId: number;
}

export interface GetCommentsForArticleDTO {
  articleId: number;
  cursor?: number;
  limit?: number;
}

export interface GetCommentsForProductDTO {
  productId: number;
  cursor?: number;
  limit?: number;
}

export interface UpdateCommentDTO {
  commentId: number;
  content?: string;
}

export interface DeleteCommentDTO {
  commentId: number;
}

export class CommentResponseDTO {
  id: number;
  content: string;
  productId: number | null;
  articleId: number | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(comment: Comment) {
    (this.id = comment.id),
      (this.content = comment.content),
      (this.productId = comment.productId),
      (this.articleId = comment.articleId),
      (this.authorId = comment.authorId),
      (this.createdAt = comment.createdAt),
      (this.updatedAt = comment.updatedAt);
  }
}

export class CommentListResponseDTO {
  list: CommentResponseDTO[];
  nextCursor: number | null;

  constructor(list: CommentResponseDTO[], nextCursor: number | null) {
    (this.list = list), (this.nextCursor = nextCursor);
  }
}
