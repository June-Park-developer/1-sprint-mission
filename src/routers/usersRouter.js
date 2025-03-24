import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { createUser } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.post('/', withAsync(createUser));

export default usersRouter;
