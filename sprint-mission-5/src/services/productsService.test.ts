import * as productsRepository from '../repositories/productsRepository';
import * as productsService from '../services/productsService';
import * as likedProductsRepository from '../repositories/likedProductsRepository';
import { LikedProduct } from '../typings/likedProductTypes';
import { Product } from '../typings/productTypes';

jest.mock('../repositories/productsRepository');
jest.mock('../repositories/likedProductsRepository');

// Mock 데이터
const mockDate = new Date('2022-02-02T00:00:00.000Z');
const mockCreateProductDTO = {
  name: 'mockProduct',
  description: 'mockDescription',
  price: 1000,
  tags: [],
  images: [],
  authorId: 1,
};
const mockCreatedProduct = {
  id: 1,
  ...mockCreateProductDTO,
  createdAt: mockDate,
  updatedAt: mockDate,
};
const mockLoggedInGetProductListDTO = {
  userId: 1,
  page: 1,
  pageSize: 10,
  keyword: '키워드',
};
const mockNotLoggedInGetProductListDTO = {
  // 변수명 이게 최선인가
  page: 1,
  pageSize: 10,
  keyword: '키워드',
};
const mockProductList: Product[] = [
  { id: 1, ...mockCreateProductDTO, createdAt: mockDate, updatedAt: mockDate },
  { id: 2, ...mockCreateProductDTO, createdAt: mockDate, updatedAt: mockDate },
];
const mockLikedProduct: LikedProduct = {
  userId: 1,
  productId: 1,
  createdAt: mockDate,
};
// 유닛 테스트 코드
describe('productsService 의 유닛 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('createProduct', () => {
    beforeEach(() => {
      (productsRepository.create as jest.Mock).mockResolvedValue(mockCreatedProduct);
    });
    test('createProductDTO를 받아 Product를 생성하고 반환함', async () => {
      const result = await productsService.createProduct(mockCreateProductDTO);
      expect(productsRepository.create).toHaveBeenCalledWith(mockCreateProductDTO);
      expect(result.id).toBe(mockCreatedProduct.id);
      expect(result.name).toBe(mockCreatedProduct.name);
      expect(result.price).toBe(mockCreatedProduct.price);
      expect(result.description).toBe(mockCreatedProduct.description);
    });
  });
  describe('getProductList', () => {
    beforeEach(() => {
      (productsRepository.countByKeyword as jest.Mock).mockResolvedValue(2);
      (productsRepository.getProductList as jest.Mock).mockResolvedValue(mockProductList);
    });
    test('로그인 된 경우 like한 상품은 isLiked=true 를 포함해 totalCount와 list를 반환함', async () => {
      (likedProductsRepository.getLike as jest.Mock).mockResolvedValue(mockLikedProduct);
      const result = await productsService.getProductList(mockLoggedInGetProductListDTO);
      const { userId, ...params } = mockLoggedInGetProductListDTO;
      expect(productsRepository.countByKeyword).toHaveBeenCalledWith(params.keyword);
      expect(productsRepository.getProductList).toHaveBeenCalledWith(params);
      expect(likedProductsRepository.getLike).toHaveBeenCalledTimes(mockProductList.length);
      expect(result.totalCount).toBe(2);
      expect(result.list[0].isLiked).toBe(true);
      expect(result.list[1].isLiked).toBe(true);
    });
    test('로그인 된 경우 like 안한 상품은 isLiked=false 를 포함해 totalCount와 list를 반환함', async () => {
      (likedProductsRepository.getLike as jest.Mock).mockResolvedValue(null);
      const result = await productsService.getProductList(mockLoggedInGetProductListDTO);
      const { userId, ...params } = mockLoggedInGetProductListDTO;
      expect(productsRepository.countByKeyword).toHaveBeenCalledWith(params.keyword);
      expect(productsRepository.getProductList).toHaveBeenCalledWith(params);
      expect(likedProductsRepository.getLike).toHaveBeenCalledTimes(mockProductList.length);
      expect(result.totalCount).toBe(2);
      expect(result.list[0].isLiked).toBe(false);
      expect(result.list[1].isLiked).toBe(false);
    });
    test('로그인 안 된 경우 isLiked 없이 totalCount와 list를 반환함', async () => {
      const result = await productsService.getProductList(mockNotLoggedInGetProductListDTO);
      expect(productsRepository.countByKeyword).toHaveBeenCalledWith(
        mockNotLoggedInGetProductListDTO.keyword,
      );
      expect(productsRepository.getProductList).toHaveBeenCalledWith(
        mockNotLoggedInGetProductListDTO,
      );
      expect(likedProductsRepository.getLike).toHaveBeenCalledTimes(0);
      expect(result.totalCount).toBe(2);
      console.log(result.list);
      expect(result.list[0]).not.toHaveProperty('isLiked');
      expect(result.list[1]).not.toHaveProperty('isLiked');
    });
  });
});
