import {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
  GetProductListDTO,
} from '../DTO/productsDTO';
import productsRepository from '../repositories/productsRepository';
import likedProductsRepository from '../repositories/likedProductsRepository';
import { Product } from '../typings/productTypes';
import NotFoundError from '../lib/errors/NotFoundError';

const toResponseProductDTO = (product: Product, isLiked: boolean = false): ProductResponseDTO => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  tags: product.tags,
  images: product.images,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  authorId: product.authorId,
  isLiked,
});

const createProduct = async (productData: CreateProductDTO) => {
  const product = await productsRepository.create(productData);
  const responseProduct = toResponseProductDTO(product);
  return responseProduct;
};

const getProduct = async (productId: number, userId: number) => {
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const likedProduct = await likedProductsRepository.getLike(userId, productId);
  const isLiked = !!likedProduct;
  const responseProduct = toResponseProductDTO(product, isLiked);
  return responseProduct;
};

const updateProduct = async (productId: number, productData: UpdateProductDTO) => {
  const product = await productsRepository.update(productId, productData);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const responseProduct = toResponseProductDTO(product);
  return responseProduct;
};

const deleteProduct = async (productId: number) => {
  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  await productsRepository.deleteById(productId);
};

export default { createProduct, getProduct, updateProduct, deleteProduct };
