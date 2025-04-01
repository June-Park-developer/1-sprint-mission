import { Infer } from 'superstruct';
import {
  CreateArticleBodyStruct,
  GetArticleListParamsStruct,
  UpdateArticleBodyStruct,
} from '../structs/articlesStructs';

export type Article = {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
};

export type GetArticleListParamsInput = Infer<typeof GetArticleListParamsStruct>;
