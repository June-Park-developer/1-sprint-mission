import app from '../app';
import {
  createTestUser,
  createTestProduct,
  createTestProductComment,
  clearTestDB,
  disconnectTestDB,
} from '../lib/testUtils';
import request from 'supertest';
import { Product } from '../typings/productTypes';

// testDB 에 들어갈 dummy 데이터
const testUser1 = {
  email: 'test@example.com',
  nickname: 'testUser1',
  password: 'password1234',
};

const testProduct1 = {
  name: 'testProduct1',
  description: 'testProduct1 description',
  images: [],
  price: 1000,
  tags: [],
};
const testProduct2 = {
  name: 'testProduct2',
  description: 'testProduct2 description',
  images: [],
  price: 2000,
  tags: [],
};

const testProductComment1 = {
  content: '테스트 Comment1',
};
const testProductComment2 = {
  content: '테스트 Comment2',
};

// 테스트 코드

describe('인증 필요하지 않은 상품 API', () => {
  beforeEach(async () => {
    await clearTestDB();
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe('GET /products', () => {
    let product1: Product;
    let product2: Product;
    beforeEach(async () => {
      const user = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user.id });
      product2 = await createTestProduct({ ...testProduct2, authorId: user.id });
    });
    describe('정상적인 상품목록 조회', () => {
      test('쿼리 없이 조회 시 기본값에 맞게 조회됨', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(2);
        expect(response.body.totalCount).toBe(2);
        expect(response.body.list[0]).toMatchObject({
          name: product1.name,
          price: product1.price,
          id: product1.id,
        });
        expect(response.body.list[1]).toMatchObject({
          name: testProduct2.name,
          price: testProduct2.price,
        });
        expect(response.body.list[1]).toHaveProperty('createdAt');
        expect(response.body.list[1]).toHaveProperty('id');
      });
    });
  });
  describe('GET /products/:id', () => {
    let product1: Product;
    beforeEach(async () => {
      const user = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user.id });
    });
    describe('정상적인 상품 상세조회', () => {
      test('정상 작동', async () => {
        const response = await request(app).get(`/products/${product1.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(testProduct1);
      });
    });
    describe('상품 상세조회 오류', () => {});
  });
  describe('GET /products/:id/comments', () => {
    let product1: Product;
    beforeEach(async () => {
      const user = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user.id });
      await createTestProductComment({
        ...testProductComment1,
        authorId: user.id,
        productId: product1.id,
      });
      await createTestProductComment({
        ...testProductComment2,
        authorId: user.id,
        productId: product1.id,
      });
    });
    describe('정상', () => {
      test('정상 댓글 목록 조회', async () => {
        const response = await request(app).get(`/products/${product1.id}/comments`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(2);
        expect(response.body.nextCursor).toBe(null);
        expect(response.body.list[0]).toMatchObject(testProductComment2);
        expect(response.body.list[1]).toMatchObject(testProductComment1);
      });
    });
    describe('댓글 조회 오류', () => {});
  });
});
// describe('인증 필요한 상품 API', () => {});
