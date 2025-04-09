import { Infer } from 'superstruct';
import {
  CreateProductBodyStruct,
  GetMyProductsParamsStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';

// Entity
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
};

// Input (Service <->Repository)
type CreateProductBody = Infer<typeof CreateProductBodyStruct>;
export type CreateProductInput = CreateProductBody & { authorId: number };

export type UpdateProductInput = Infer<typeof UpdateProductBodyStruct>;

export type GetProductListParamsInput = Infer<typeof GetProductListParamsStruct>;

type GetMyProductsParams = Infer<typeof GetMyProductsParamsStruct>;
export type GetMyProductsParamsInput = GetMyProductsParams & { authorId: number };
