// Entity
export interface Comment {
  id: number;
  content: string;
  productId: number | null;
  articleId: number | null;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Input
export type GetCommentListInput = {
  articleId: number | null;
  productId: number | null;
};
