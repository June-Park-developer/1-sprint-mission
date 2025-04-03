import { coerce, partial, object, string, min, array, integer, size } from 'superstruct';
import { PageParamsStruct, PageParamsWithoutKeywordStruct } from './commonStructs';

export const CreateProductBodyStruct = object({
  name: coerce(size(string(), 2, 20), string(), (value) => value.trim()),
  description: size(string(), 2, 500),
  price: min(integer(), 0),
  tags: array(size(string(), 1, 20)),
  images: array(size(string(), 1, 100)),
});

export const GetProductListParamsStruct = PageParamsStruct;
export const GetMyProductsParamsStruct = PageParamsWithoutKeywordStruct;

export const UpdateProductBodyStruct = partial(CreateProductBodyStruct);
