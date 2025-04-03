import { User } from '../../typings/userTypes';

export function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}
