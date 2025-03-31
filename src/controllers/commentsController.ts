import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs.js';
import commentsRepository from '../repositories/commentsRepository.js';
import { Request, RequestHandler, Response } from 'express';

export const updateComment: RequestHandler = async (req, res) => {
  const { id: commentId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await commentsRepository.getById(commentId);
  if (!existingComment) {
    throw new NotFoundError(`Comment with id ${commentId} is not found`);
  }

  const updatedComment = await commentsRepository.update(commentId, content);

  res.send(updatedComment);
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { id: commentId } = create(req.params, IdParamsStruct);

  const existingComment = await commentsRepository.getById(commentId);
  if (!existingComment) {
    throw new NotFoundError(`Comment with id ${commentId} is not found`);
  }

  await commentsRepository.deleteById(commentId);

  res.status(204).send();
};
