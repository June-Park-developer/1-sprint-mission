import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { RequestHandler } from 'express';
import * as articlesService from '../services/articlesService';
import {
  CreateArticleDTO,
  DeleteArticleDTO,
  GetArticleDTO,
  GetArticleListDTO,
  LikeArticleDTO,
  UpdateArticleDTO,
} from '../DTO/articlesDTO';
import * as commentsService from '../services/commentsService';
import * as notiService from '../services/notificationsService';
import { CreateArticleCommentDTO, GetCommentsForArticleDTO } from '../DTO/commentsDTO';
import { createCommentNotiDTO } from '../DTO/notificationsDTO';

export const createArticle: RequestHandler = async (req, res) => {
  const { title, content, image } = create(req.body, CreateArticleBodyStruct);
  const { userId } = req.user!;
  const dto: CreateArticleDTO = {
    title,
    content,
    image,
    authorId: userId,
  };
  const article = await articlesService.createArticle(dto);
  res.status(201).send(article);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const dto: GetArticleDTO = { articleId, userId };
  const responseArticle = await articlesService.getArticle(dto);
  res.json(responseArticle);
};

export const updateArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const userId = req.user!.userId;
  const articleData = create(req.body, UpdateArticleBodyStruct);
  const dto: UpdateArticleDTO = { articleId, userId, ...articleData };
  const responseArticle = await articlesService.updateArticle(dto);
  res.json(responseArticle);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const dto: DeleteArticleDTO = { articleId };
  await articlesService.deleteArticle(dto);
  res.status(204).send();
};

export const getArticleList: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const params = create(req.query, GetArticleListParamsStruct);
  const dto: GetArticleListDTO = { userId, ...params };
  const responseArticles = await articlesService.getArticleList(dto);
  res.json(responseArticles);
};

export const likeArticle: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const dto: LikeArticleDTO = { userId, articleId };
  const isLiked = await articlesService.likeArticle(dto);
  if (isLiked) {
    res.status(201).json({ message: 'Article liked successfully' });
  } else {
    res.status(204).json({ message: 'Article unliked successfuly' });
  }
};

export const createComment: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user!.userId;
  const commentDto: CreateArticleCommentDTO = {
    articleId,
    content,
    authorId,
  };
  const article = await articlesService.getArticle({ articleId });
  const comment = await commentsService.createCommentForArticle(commentDto);
  const notiDto: createCommentNotiDTO = {
    articleId,
    userId: article.authorId,
    commentId: comment.id,
  };
  await notiService.createCommentNoti(notiDto);
  res.status(201).send(comment);
};

export const getCommentList: RequestHandler = async (req, res) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit = 10 } = create(req.query, GetCommentListParamsStruct);
  const dto: GetCommentsForArticleDTO = { articleId, cursor, limit };
  const commentsResponse = await commentsService.getCommentsForArticle(dto);
  res.json(commentsResponse);
};
