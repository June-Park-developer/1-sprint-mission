import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import commentsRepository from '../repositories/commentsRepository.js';

export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await commentsRepository.getById(id);
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  const updatedComment = await commentsRepository.update(id, content);

  return res.send(updatedComment);
}

export async function deleteComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await commentsRepository.getById(id);
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  await commentsRepository.deleteById(id);

  return res.status(204).send();
}
