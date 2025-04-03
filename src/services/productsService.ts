import {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
  GetProductListDTO,
  ProductListResponseDTO,
  LikeProductDTO,
  GetMyProductListDTO,
  GetMyLikedProductListDTO,
} from '../DTO/productsDTO';
import productsRepository from '../repositories/productsRepository';
import likedProductsRepository from '../repositories/likedProductsRepository';
import { Product } from '../typings/productTypes';
import NotFoundError from '../lib/errors/NotFoundError';

const toProductResponseDTO = (product: Product, isLiked: boolean = false): ProductResponseDTO => ({
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
  const responseProduct = toProductResponseDTO(product);
  return responseProduct;
};

const getProduct = async (productId: number, userId?: number) => {
  const product = await productsRepository.getById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const isLiked = userId ? !!(await likedProductsRepository.getLike(userId, productId)) : false;
  return toProductResponseDTO(product, isLiked);
};

const updateProduct = async (productId: number, productData: UpdateProductDTO) => {
  const product = await productsRepository.update(productId, productData);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const responseProduct = toProductResponseDTO(product);
  return responseProduct;
};

const deleteProduct = async (productId: number) => {
  const existingProduct = await productsRepository.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  await productsRepository.deleteById(productId);
};

const getProductList = async (dto: GetProductListDTO) => {
  const { userId, ...params } = dto;
  const totalCount = await productsRepository.countByKeyword(params.keyword);
  const products = await productsRepository.getProductList(params);

  const list = await Promise.all(
    products.map(async (product) => {
      if (userId) {
        const liked = await likedProductsRepository.getLike(userId, product.id);
        return toProductResponseDTO(product, !!liked);
      }
      return toProductResponseDTO(product);
    }),
  );
  const productList: ProductListResponseDTO = { list, totalCount };
  return productList;
};

const getMyProductList = async (dto: GetMyProductListDTO) => {
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
      return toProductResponseDTO(product, !!liked);
    }),
  );
  const productList: ProductListResponseDTO = { list, totalCount };
  return productList;
};

const getMyLikedProductList = async (dto: GetMyLikedProductListDTO) => {
  const { userId, page, pageSize, orderBy } = dto;
  const totalCount = await likedProductsRepository.countByUserId(userId);
  const likedProducts = await likedProductsRepository.getLikedProductList({
    userId,
    page,
    pageSize,
    orderBy,
  });
  const list = likedProducts.map((product) => toProductResponseDTO(product, true));
  const productList: ProductListResponseDTO = { list, totalCount };
  return productList;
};

const likeProduct = async (dto: LikeProductDTO) => {
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

export default {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  getMyProductList,
  getMyLikedProductList,
  likeProduct,
};
