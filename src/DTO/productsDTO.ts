// Request
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  authorId: number;
}

export interface UpdateProductDTO {}

export interface GetProductListDTO {}

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
