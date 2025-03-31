import { expressjwt } from 'express-jwt';
import { JWT_SECRET } from '../lib/constants';
import { RequestHandler } from 'express';
import { Jwt, Secret } from 'jsonwebtoken';

export const verifyAccessToken = expressjwt({
  secret: JWT_SECRET as Secret,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

export const optionalAccessToken = expressjwt({
  secret: JWT_SECRET as Secret,
  algorithms: ['HS256'],
  credentialsRequired: false,
  requestProperty: 'user',
});

export const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET as Secret,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});
