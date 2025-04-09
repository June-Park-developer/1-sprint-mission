import { expressjwt } from 'express-jwt';
import { JWT_SECRET } from '../lib/constants';
import { Secret } from 'jsonwebtoken';

export const verifyAccessToken = expressjwt({
  secret: JWT_SECRET as Secret,
  algorithms: ['HS256'],
  requestProperty: 'user',
  getToken: (req) => req.cookies.accessToken,
});

export const optionalAccessToken = expressjwt({
  secret: JWT_SECRET as Secret,
  algorithms: ['HS256'],
  credentialsRequired: false,
  requestProperty: 'user',
  getToken: (req) => req.cookies.accessToken,
});

export const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET as Secret,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});
