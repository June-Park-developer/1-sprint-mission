import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { RequestHandler } from 'express';
import * as commentsService from '../services/commentsService';

export const updateComment: RequestHandler = async (req, res) => {
  const { id: commentId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const dto = { commentId, content };
  const commentResponse = await commentsService.updateComment(dto);
  res.send(commentResponse);
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { id: commentId } = create(req.params, IdParamsStruct);
  const dto = { commentId };
  await commentsService.deleteComment(dto);
  res.status(204).send();
};
