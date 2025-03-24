import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { createUser, loginUser } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.post('/', withAsync(createUser));
usersRouter.post('/login', withAsync(loginUser));

export default usersRouter;
