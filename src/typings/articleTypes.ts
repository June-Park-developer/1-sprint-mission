import { Infer } from 'superstruct';
import {
  CreateArticleBodyStruct,
  GetArticleListParamsStruct,
  UpdateArticleBodyStruct,
} from '../structs/articlesStructs';

// Entity
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

// Input
export type GetArticleListParamsInput = Infer<typeof GetArticleListParamsStruct>;
