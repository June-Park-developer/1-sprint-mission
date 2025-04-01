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
