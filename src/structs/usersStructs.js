import * as s from 'superstruct';
import isEmail from 'is-email';

const Email = s.refine(s.string(), 'email', (value) => isEmail(value));

export const CreateUserBodyStruct = s.object({
  email: Email,
  nickname: s.size(s.string(), 2, 20),
  password: s.size(s.string(), 6, 20),
});

export const LoginUserBodyStruct = s.object({
  email: Email,
  password: s.size(s.string(), 6, 20),
});
// export const GetProductListParamsStruct = PageParamsStruct;

// export const UpdateProductBodyStruct = partial(CreateProductBodyStruct);
