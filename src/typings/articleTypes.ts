import { Infer } from 'superstruct';
import {
  CreateArticleBodyStruct,
  GetArticleListParamsStruct,
  UpdateArticleBodyStruct,
} from '../structs/articlesStructs';

export type GetArticleListParamsInput = Infer<typeof GetArticleListParamsStruct>;
