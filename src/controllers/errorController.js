import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

export function defaultNotFoundHandler(req, res, next) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(err, req, res, next) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From express.json middleware */
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  if (err.name === 'ConflictError') {
    return res.status(409).send({ message: 'Resource already exists.' });
  }
  if (err.name === 'ForbiddenError') {
    console.log(err);
    return res.status(403).send({ message: 'You do not have permission to access this resource.' });
  }
  if (err.name === 'UnauthorizedError') {
    console.log(err);
    return res.status(401).send({ message: err.message });
  }
  /** Application error */
  if (err.name === 'NotFoundError') {
    console.log(err);
    return res.status(404).send({ message: err.message });
  }

  if (err.code) {
    console.error(err);
    return res.status(500).send({ message: 'Failed to process data' });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
