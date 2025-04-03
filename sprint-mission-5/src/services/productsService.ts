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
} from '../DTO/productsDTO';
import productsRepository from '../repositories/productsRepository';
import likedProductsRepository from '../repositories/likedProductsRepository';
import NotFoundError from '../lib/errors/NotFoundError';

const createProduct = async (dto: CreateProductDTO) => {
  const product = await productsRepository.create(dto);
  return new ProductResponseDTO(product);
};

const getProduct = async (dto: GetProductDTO) => {
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

const updateProduct = async (dto: UpdateProductDTO) => {
  const { productId, userId, ...productData } = dto;
  const product = await productsRepository.update(productId, productData);
  if (!product) {
    throw new NotFoundError(`Product with id ${productId} is not found`);
  }
  const isLiked = !!(await likedProductsRepository.getLike(userId, productId));
  return new ProductResponseDTO(product, isLiked);
};

const deleteProduct = async (dto: DeleteProductDTO) => {
  const { productId } = dto;
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
        return new ProductResponseDTO(product, !!liked);
      }
      return new ProductResponseDTO(product);
    }),
  );
  return new ProductListResponseDTO(list, totalCount);
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

// usersController.ts와 연결
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
      return new ProductResponseDTO(product, !!liked);
    }),
  );
  return new ProductListResponseDTO(list, totalCount);
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
  const list = likedProducts.map((product) => new ProductResponseDTO(product, true));
  return new ProductListResponseDTO(list, totalCount);
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
