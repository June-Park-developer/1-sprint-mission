import { Article } from '../typings/articleTypes';

export interface CreateArticleDTO {
  title: string;
  content: string;
  image: string | null;
  authorId: number;
}

export interface GetArticleDTO {
  articleId: number;
  userId?: number;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  image?: string | null;
  articleId: number;
  userId: number;
}

export interface DeleteArticleDTO {
  articleId: number;
}

export interface GetArticleListDTO {
  userId?: number;
  page: number;
  pageSize: number;
  orderBy?: 'recent' | undefined;
  keyword?: string | undefined;
}

export interface LikeArticleDTO {
  userId: number;
  articleId: number;
}

export class ArticleResponseDTO {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;

  constructor(article: Article, isLiked?: boolean) {
    this.id = article.id;
    this.title = article.title;
    this.content = article.content;
    this.image = article.image;
    this.authorId = article.authorId;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.isLiked = isLiked;
  }
}

export class ArticleListResponseDTO {
  list: ArticleResponseDTO[];
  totalCount: number;

  constructor(list: ArticleResponseDTO[], totalCount: number) {
    this.list = list;
    this.totalCount = totalCount;
  }
}
