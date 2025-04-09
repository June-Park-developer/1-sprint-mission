import { StructError } from 'superstruct';
import { BadRequestError } from '../lib/errors/BadRequestError';
import { ErrorRequestHandler, RequestHandler } from 'express';

export const defaultNotFoundHandler: RequestHandler = (req, res) => {
  res.status(404).send({ message: 'Not found' });
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
  }

  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    res.status(400).send({ message: 'Invalid JSON' });
  }

  if (err.name === 'ConflictError') {
    res.status(409).send({ message: 'Resource already exists.' });
  }
  if (err.name === 'ForbiddenError') {
    console.log(err);
    res.status(403).send({ message: 'You do not have permission to access this resource.' });
  }
  if (err.name === 'UnauthorizedError') {
    console.log(err);
    res.status(401).send({ message: err.message });
  }

  if (err.name === 'NotFoundError') {
    console.log(err);
    res.status(404).send({ message: err.message });
  }

  if (err.code) {
    console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
};
