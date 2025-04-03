import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { updateComment, deleteComment } from '../controllers/commentsController.js';
import { verifyAccessToken } from '../middlewares/verifyToken.js';
import { verifyCommentAuth } from '../middlewares/verifyAuth.js';
const commentsRouter = express.Router();

commentsRouter.patch('/:id', verifyAccessToken, verifyCommentAuth, withAsync(updateComment));
commentsRouter.delete('/:id', verifyAccessToken, verifyCommentAuth, withAsync(deleteComment));

export default commentsRouter;
