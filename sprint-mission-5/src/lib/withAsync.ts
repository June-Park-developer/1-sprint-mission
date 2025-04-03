import { RequestHandler } from 'express';
import { NextFunction, Request, Response } from 'express';

export function withAsync(handler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
