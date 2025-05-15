import {
  CommentListResponseDTO,
  CommentResponseDTO,
  CreateArticleCommentDTO,
  CreateProductCommentDTO,
  DeleteCommentDTO,
  GetCommentsForArticleDTO,
  GetCommentsForProductDTO,
  UpdateCommentDTO,
} from '../DTO/commentsDTO';
import * as commentsRepository from '../repositories/commentsRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as articlesRepository from '../repositories/articlesRepository';
import { NotFoundError } from '../lib/errors/NotFoundError';

export const createCommentForArticle = async (
  dto: CreateArticleCommentDTO,
): Promise<CommentResponseDTO> => {
  const comment = await commentsRepository.createForArticle(dto);
  return new CommentResponseDTO(comment);
};

export const createCommentForProduct = async (dto: CreateProductCommentDTO) => {
  const { productId, content, authorId } = dto;
  const existingProduct = await articlesRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(` with id ${productId} does not exist.`);
  }
  const comment = await commentsRepository.createForProduct(dto);
  return new CommentResponseDTO(comment);
};

export const getCommentsForArticle = async (dto: GetCommentsForArticleDTO) => {
  const { articleId, cursor, limit = 10 } = dto;
  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const commentsWithCursor = await commentsRepository.getCommentsForArticle(
    articleId,
    limit,
    cursor,
  );
  const list = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[limit - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;
  return new CommentListResponseDTO(list, nextCursor);
};

export const getCommentsForProduct = async (dto: GetCommentsForProductDTO) => {
  const { productId, cursor, limit = 10 } = dto;
  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Article with id ${productId} is not found`);
  }
  const commentsWithCursor = await commentsRepository.getCommentsForProduct(
    productId,
    limit,
    cursor,
  );
  const list = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[limit - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;
  return new CommentListResponseDTO(list, nextCursor);
};

export const updateComment = async (dto: UpdateCommentDTO) => {
  const { commentId, content } = dto;
  const existingComment = await commentsRepository.getById(commentId);
  if (!existingComment) {
    throw new NotFoundError(`Comment with id ${commentId} is not found`);
  }
  const updatedComment: CommentResponseDTO = await commentsRepository.update(commentId, content);
  return updatedComment;
};

export const deleteComment = async (dto: DeleteCommentDTO) => {
  const { commentId } = dto;

  const existingComment = await commentsRepository.getById(commentId);
  if (!existingComment) {
    throw new NotFoundError(`Comment with id ${commentId} is not found`);
  }

  await commentsRepository.deleteById(commentId);
};
