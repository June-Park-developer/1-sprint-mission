import { Infer } from 'superstruct';
import {
  CreateArticleBodyStruct,
  GetArticleListParamsStruct,
  UpdateArticleBodyStruct,
} from '../structs/articlesStructs';

// Entity
export interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Input (Service <-> Repository)
export type GetArticleListParamsInput = Infer<typeof GetArticleListParamsStruct>;
