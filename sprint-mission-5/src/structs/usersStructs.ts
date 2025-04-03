import * as s from 'superstruct';
import { PageParamsWithoutKeywordStruct } from './commonStructs';

const Email = s.define<string>(
  'Email',
  (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
);

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

export const PatchMyInfoBodyStruct = s.object({
  email: s.optional(Email),
  nickname: s.optional(s.size(s.string(), 2, 20)),
  image: s.optional(s.string()),
});

export const PatchMyPasswordStruct = s.object({
  password: s.size(s.string(), 6, 20),
});

export const GetLikedProductListParamsStruct = PageParamsWithoutKeywordStruct;
