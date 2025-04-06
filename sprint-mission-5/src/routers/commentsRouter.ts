import express from 'express';
import { withAsync } from '../lib/withAsync';
import { updateComment, deleteComment } from '../controllers/commentsController';
import { verifyAccessToken } from '../middlewares/verifyToken';
import { verifyCommentAuth } from '../middlewares/verifyAuth';
export const commentsRouter = express.Router();

commentsRouter.patch('/:id', verifyAccessToken, verifyCommentAuth, withAsync(updateComment));
commentsRouter.delete('/:id', verifyAccessToken, verifyCommentAuth, withAsync(deleteComment));
