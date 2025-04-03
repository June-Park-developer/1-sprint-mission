// Request
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  authorId: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
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

// Response
export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  isLiked: boolean;
}

export interface ProductListResponseDTO {
  list: ProductResponseDTO[];
  totalCount: number;
}
