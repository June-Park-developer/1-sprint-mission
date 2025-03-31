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
import { NextFunction, Request, RequestHandler, Response } from 'express';

// Article
export const createArticle: RequestHandler = async (req, res) => {
  const parsed = create(req.body, CreateArticleBodyStruct);
  const { userId } = req.user!;
  const data = {
    ...parsed,
    authorId: userId,
  };
  const article = await articlesRepository.create(data);
  res.status(201).send(article);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }
  const { userId } = req.user!;
  let isLiked = false;
  if (userId) {
    const likedArticle = await likedArticlesRepository.getLike(userId, articleId);
    isLiked = likedArticle ? true : false;
  }
  res.send({ ...article, isLiked });
};

export const updateArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await articlesRepository.update(articleId, data);
  if (!article) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }

  res.send(article);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);

  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError(`Article with id ${articleId} is not found`);
  }

  await articlesRepository.deleteById(articleId);

  res.status(204).send();
};

export const getArticleList: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const totalCount = await articlesRepository.countByKeyword(keyword);
  const articles = await articlesRepository.getArticleList({ page, pageSize, orderBy, keyword });

  res.send({
    list: articles,
    totalCount,
  });
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
