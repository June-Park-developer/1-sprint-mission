import * as s from 'superstruct';
import { CursorParamsStruct } from './commonStructs';

export const CreateCommentBodyStruct = s.object({
  content: s.size(s.string(), 2, 200),
});

export const GetCommentListParamsStruct = CursorParamsStruct;

export const UpdateCommentBodyStruct = s.partial(CreateCommentBodyStruct);
