import { Article } from '../typings/articleTypes';

// Request
export interface CreateArticleDTO {
  title: string;
  content: string;
  image: string | null;
  authorId: number;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  image?: string | null;
}

export interface GetArticleListDTO {
  page: number;
  pageSize: number;
  orderBy?: 'recent' | undefined;
  keyword?: string | undefined;
}

export interface LikeArticleDTO {
  userId: number;
  articleId: number;
}

// Response
export interface ArticleResponseDTO {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
}

export interface ArticleListResponseDTO {
  list: ArticleResponseDTO[];
  totalCount: number;
}
