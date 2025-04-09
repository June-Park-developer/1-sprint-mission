import { Infer } from 'superstruct';
import { GetLikedProductListParamsStruct } from '../structs/usersStructs';

// Entity
export interface LikedProduct {
  userId: number;
  productId: number;
  createdAt: Date;
}

// Input
type LikedProductListParams = Infer<typeof GetLikedProductListParamsStruct>;
export type LikedProductListParamsInput = LikedProductListParams & { userId: number };
