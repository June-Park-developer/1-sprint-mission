import { Infer } from 'superstruct';
import { CreateCommentBodyStruct, UpdateCommentBodyStruct } from '../structs/commentsStruct';

type CreateCommentBody = Infer<typeof CreateCommentBodyStruct>;
export type CreateCommentInput = CreateCommentBody & {
  authorId: number;
  articleId?: number;
  productId?: number;
};
