import { Product } from '../typings/productTypes';

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  authorId: number;
}

export interface GetProductDTO {
  productId: number;
  userId?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
  productId: number;
  userId: number;
}

export interface DeleteProductDTO {
  productId: number;
}

export interface GetProductListDTO {
  userId?: number;
  page: number;
  pageSize: number;
  orderBy?: 'recent' | undefined;
  keyword?: string | undefined;
}

export interface GetMyProductListDTO {
  authorId: number;
  page: number;
  pageSize: number;
  orderBy?: 'recent' | undefined;
}

export interface LikeProductDTO {
  userId: number;
  productId: number;
}

export interface GetMyLikedProductListDTO {
  userId: number;
  page: number;
  pageSize: number;
  orderBy?: 'recent' | undefined;
}

export class ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  isLiked?: boolean;

  constructor(product: Product, isLiked?: boolean) {
    (this.id = product.id),
      (this.name = product.name),
      (this.description = product.description),
      (this.price = product.price),
      (this.tags = product.tags),
      (this.images = product.images),
      (this.createdAt = product.createdAt),
      (this.updatedAt = product.updatedAt),
      (this.authorId = product.authorId),
      (this.isLiked = isLiked);
  }
}

export class ProductListResponseDTO {
  list: ProductResponseDTO[];
  totalCount: number;

  constructor(list: ProductResponseDTO[], totalCount: number) {
    (this.list = list), (this.totalCount = totalCount);
  }
}
