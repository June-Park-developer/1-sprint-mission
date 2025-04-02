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
  page: number;
  pageSize: number;
  orderBy?: 'recent' | undefined;
  keyword?: string | undefined;
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
