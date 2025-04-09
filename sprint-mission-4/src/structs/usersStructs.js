import * as s from 'superstruct';
import isEmail from 'is-email';
import { PageParamsWithoutKeywordStruct } from './commonStructs.js';

const Email = s.refine(s.string(), 'email', (value) => isEmail(value));

export const CreateUserBodyStruct = s.object({
  email: Email,
  nickname: s.size(s.string(), 2, 20),
  password: s.size(s.string(), 6, 20),
});

export const LoginUserBodyStruct = s.object({
  email: Email,
  password: s.size(s.string(), 6, 20),
});

const PatchMyInfoBody = s.object({
  email: Email,
  nickname: s.size(s.string(), 2, 20),
  password: s.size(s.string(), 6, 20),
  image: s.string(),
});

export const PatchMyInfoBodyStruct = s.partial(PatchMyInfoBody);

export const PatchMyPasswordStruct = s.object({
  password: s.size(s.string(), 6, 20),
});

export const GetLikedProductListParamsStruct = PageParamsWithoutKeywordStruct;
