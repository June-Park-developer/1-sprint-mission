import { Infer } from 'superstruct';
import { GetLikedProductListParamsStruct } from '../structs/usersStructs';

type LikedProductListParams = Infer<typeof GetLikedProductListParamsStruct>;
export type LikedProductListParamsInput = LikedProductListParams & { userId: number };
