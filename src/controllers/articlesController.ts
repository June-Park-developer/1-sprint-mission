import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import commentsRepository from '../repositories/commentsRepository';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import articlesRepository from '../repositories/articlesRepository';
import likedArticlesRepository from '../repositories/likedArtriclesRepository';
import ConflictError from '../lib/errors/ConflictError';
import { RequestHandler } from 'express';
import articlesService from '../services/articlesService';
// Article
export const createArticle: RequestHandler = async (req, res) => {
  const parsed = create(req.body, CreateArticleBodyStruct);
  const { userId } = req.user!;
  const data = {
    ...parsed,
    authorId: userId,
  };
  const result = await articlesService.createArticle(data);
  res.status(201).send(result);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { userId } = req.user!;
  const result = await articlesService.getArticle(articleId, userId);
  res.send(result);
};

export const updateArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const result = await articlesService.updateArticle(articleId, data);
  res.json(result);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articlesService.deleteArticle(articleId);
  res.status(204).send();
};

export const getArticleList: RequestHandler = async (req, res) => {
  const params = create(req.query, GetArticleListParamsStruct);
  const result = await articlesService.getArticleList(params);
  res.json(result);
};

// Comment
export const createComment: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user!.userId;
  const data = { articleId, content, authorId };
  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }

  const comment = await commentsRepository.create(data);

  res.status(201).send(comment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }

  const commentsWithCursor = await commentsRepository.getCommentsForArticle(
    articleId,
    limit,
    cursor,
  );
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
};

// Like, Unlike
export const likeArticle: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const existingLikedArticle = await likedArticlesRepository.getLike(userId, articleId);
  if (existingLikedArticle) {
    throw new ConflictError('like');
  }
  await likedArticlesRepository.createLike(userId, articleId);
  res.status(201).json({ message: 'Article liked successfully' });
};

export const unlikeArticle: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const existingLikedArticle = await likedArticlesRepository.getLike(userId, articleId);
  if (!existingLikedArticle) {
    throw new NotFoundError(`This article is not liked by user ${userId}`);
  }
  await likedArticlesRepository.deleteLike(userId, articleId);
  res.status(204).json({ message: 'Article unliked successfuly' });
};
