import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import commentsRepository from '../repositories/commentsRepository.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import articlesRepository from '../repositories/articlesRepository.js';
import likedArticlesRepository from '../repositories/likedArtriclesRepository.js';
import ConflictError from '../lib/errors/ConflictError.js';

// Article
export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);
  const authorId = req.user.userId;
  data.authorId = authorId;
  const article = await articlesRepository.create(data);
  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }
  const { userId } = req.user || {};
  let isLiked = false;
  if (userId) {
    const likedArticle = await likedArticlesRepository.getLike(userId, articleId);
    isLiked = likedArticle ? true : false;
  }

  return res.send({ ...article, isLiked });
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await articlesRepository.update(id, data);
  if (!article) {
    throw new NotFoundError('article', id);
  }

  return res.send(article);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await articlesRepository.getById(id);
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  await articlesRepository.deleteById(id);

  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const totalCount = await articlesRepository.countByKeyword(keyword);
  const articles = await articlesRepository.getArticleList({ page, pageSize, orderBy, keyword });

  return res.send({
    list: articles,
    totalCount,
  });
}

// Comment
export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const authorId = req.user.userId;
  const data = { articleId, content, authorId };
  const existingArticle = await articlesRepository.getById(articleId);
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const comment = await commentsRepository.create(data);

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await articlesRepository.getById(articleId);
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await commentsRepository.getCommentsForArticle(
    articleId,
    limit,
    cursor,
  );
  console.log(commentsWithCursor);
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

// Like, Unlike
export async function likeArticle(req, res) {
  const { userId } = req.user;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const existingLikedArticle = await likedArticlesRepository.getLike(userId, articleId);
  if (existingLikedArticle) {
    throw new ConflictError('like');
  }
  await likedArticlesRepository.createLike(userId, articleId);
  return res.status(201).json({ message: 'Article liked successfully' });
}

export async function unlikeArticle(req, res) {
  const { userId } = req.user;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const existingLikedArticle = await likedArticlesRepository.getLike(userId, articleId);
  if (!existingLikedArticle) {
    throw new NotFoundError('likedArticle', userId);
  }
  await likedArticlesRepository.deleteLike(userId, articleId);
  return res.status(204).json({ message: 'Article unliked successfuly' });
}
