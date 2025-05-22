import {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
  GetProductListDTO,
  ProductListResponseDTO,
  LikeProductDTO,
  GetMyProductListDTO,
  GetMyLikedProductListDTO,
  GetProductDTO,
  DeleteProductDTO,
  ProductSummaryDTO,
} from '../DTO/productsDTO';
import * as productsRepository from '../repositories/productsRepository';
import * as likedProductsRepository from '../repositories/likedProductsRepository';
import * as notiRepository from '../repositories/notificationsRepository';
import { NotFoundError } from '../lib/errors/NotFoundError';
import { PayloadForPriceNoti } from '../typings/notificationTypes';
import { NotificationType } from '@prisma/client';

export const createProduct = async (dto: CreateProductDTO) => {
  const product = await productsRepository.create(dto);
  return new ProductResponseDTO(product);
};

export const getProduct = async (dto: GetProductDTO) => {
  const { productId, userId } = dto;
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  if (userId) {
    const isLiked = !!(await likedProductsRepository.getLike(userId, productId));
    return new ProductResponseDTO(product, isLiked);
  } else {
    return new ProductResponseDTO(product);
  }
};

export const updateProduct = async (dto: UpdateProductDTO) => {
  const { productId, userId, ...productData } = dto;
  const originalProduct = await productsRepository.getById(productId);
  if (!originalProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const beforePrice = originalProduct.price;
  const updatedProduct = await productsRepository.update(productId, productData);
  const afterPrice = updatedProduct.price;
  const isLiked = !!(await likedProductsRepository.getLike(userId, productId));
  const product = new ProductResponseDTO(updatedProduct, isLiked);
  return { product, beforePrice, afterPrice };
};

export const deleteProduct = async (dto: DeleteProductDTO) => {
  const { productId } = dto;
  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  await productsRepository.deleteById(productId);
};

export const getProductList = async (dto: GetProductListDTO): Promise<ProductListResponseDTO> => {
  const { userId, ...params } = dto;
  const totalCount = await productsRepository.countByKeyword(params.keyword);
  const products = await productsRepository.getProductList(params);

  const list = await Promise.all(
    products.map(async (product) => {
      if (userId) {
        const liked = await likedProductsRepository.getLike(userId, product.id);
        return new ProductSummaryDTO(product, !!liked);
      }
      return new ProductSummaryDTO(product);
    }),
  );
  return { list, totalCount };
};

export const likeProduct = async (dto: LikeProductDTO) => {
  const { userId, productId } = dto;
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const existingLikedProduct = await likedProductsRepository.getLike(userId, productId);
  if (existingLikedProduct) {
    await likedProductsRepository.deleteLike(userId, productId);
    return false;
  } else {
    await likedProductsRepository.createLike(userId, productId);
    return true;
  }
};

// usersController.ts와 연결
export const getMyProductList = async (
  dto: GetMyProductListDTO,
): Promise<ProductListResponseDTO> => {
  const { authorId, page, pageSize, orderBy } = dto;
  const totalCount = await productsRepository.countByAuthorId(authorId);
  const products = await productsRepository.getMyProductList({
    authorId,
    page,
    pageSize,
    orderBy,
  });
  const list = await Promise.all(
    products.map(async (product) => {
      const liked = await likedProductsRepository.getLike(authorId, product.id);
      return new ProductResponseDTO(product, !!liked);
    }),
  );
  return { list, totalCount };
};

export const getMyLikedProductList = async (dto: GetMyLikedProductListDTO) => {
  const { userId, page, pageSize, orderBy } = dto;
  const totalCount = await likedProductsRepository.countByUserId(userId);
  const likedProducts = await likedProductsRepository.getLikedProductList({
    userId,
    page,
    pageSize,
    orderBy,
  });
  const list = likedProducts.map((product) => new ProductResponseDTO(product, true));
  return { list, totalCount };
};

// 함수
export const createPriceNotifications = async (
  productId: number,
  beforePrice: number,
  afterPrice: number,
) => {
  const userIdTuples = await likedProductsRepository.getUserIdsByProductId(productId);
  const userIds = userIdTuples.map((u) => u.userId);
  const payload: PayloadForPriceNoti = { productId, beforePrice, afterPrice };
  await Promise.all(
    userIds.map(
      async (userId) =>
        await notiRepository.createPriceNoti({
          userId,
          type: NotificationType.PRICE,
          payload,
        }),
    ),
  );
};
