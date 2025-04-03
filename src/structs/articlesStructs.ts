import * as s from 'superstruct';
import { PageParamsStruct } from './commonStructs';

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = s.object({
  title: s.coerce(s.size(s.string(), 2, 30), s.string(), (value) => value.trim()),
  content: s.size(s.string(), 2, 500),
  image: s.nullable(s.string()),
});

export const UpdateArticleBodyStruct = s.partial(CreateArticleBodyStruct);
