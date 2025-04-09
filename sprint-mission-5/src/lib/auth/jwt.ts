import { User } from '../../typings/userTypes';
import { JWT_SECRET } from '../constants';
import jwt from 'jsonwebtoken';

export function createToken(user: User, type?: string) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
    algorithm: 'HS256' as const,
  };

  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options as jwt.SignOptions);
}
