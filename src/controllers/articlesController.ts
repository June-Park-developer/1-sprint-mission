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
import { CreateArticleDTO, GetArticleListDTO, UpdateArticleDTO } from '../DTO/articlesDTO';
import { CreateCommentInput } from '../typings/commentTypes';
import commentsService from '../services/commentsService';
import { EntityType } from '../typings/EnumTypes';
import { CreateCommentDTO, GetCommentsForArticleDTO } from '../DTO/commentsDTO';
// Article
export const createArticle: RequestHandler = async (req, res) => {
  const parsed = create(req.body, CreateArticleBodyStruct);
  const { userId } = req.user!;
  const articleData: CreateArticleDTO = {
    ...parsed,
    authorId: userId,
  };
  const article = await articlesService.createArticle(articleData);
  res.status(201).send(article);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const responseArticle = await articlesService.getArticle(articleId, userId);
  res.json(responseArticle);
};

export const updateArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const updateData: UpdateArticleDTO = create(req.body, UpdateArticleBodyStruct);

  const responseArticle = await articlesService.updateArticle(articleId, updateData);
  res.json(responseArticle);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articlesService.deleteArticle(articleId);
  res.status(204).send();
};

export const getArticleList: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const params: GetArticleListDTO = create(req.query, GetArticleListParamsStruct);
  const responseArticles = await articlesService.getArticleList(params, userId);
  res.json(responseArticles);
};

// Comment
export const createComment: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user!.userId;
  const dto: CreateCommentDTO = {
    entityName: EntityType.Article,
    articleId,
    content,
    authorId,
  };
  const comment = await commentsService.createComment(dto);
  res.status(201).send(comment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit = 10 } = create(req.query, GetCommentListParamsStruct);
  const dto: GetCommentsForArticleDTO = { articleId, cursor, limit };
  const commentsResponse = await commentsService.getCommentsForArticle(dto);
  res.json(commentsResponse);
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
