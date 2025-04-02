import { Comment } from '../typings/commentTypes';
import { EntityType } from '../typings/EnumTypes';

// Request
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

// Response
export type CommentResponseDTO = Comment;

export interface CommentListResponseDTO {
  list: CommentResponseDTO[];
  nextCursor: number | null;
}
