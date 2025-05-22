import app from '../app';
import { CreateProductCommentDTO } from '../DTO/commentsDTO';
import { CreateProductDTO } from '../DTO/productsDTO';
import { CreateUserDTO } from '../DTO/usersDTO';
import {
  createTestUser,
  createTestProduct,
  createTestProductComment,
  clearTestDB,
  disconnectTestDB,
} from '../lib/testUtils';
import request from 'supertest';

// testDB 에 들어갈 dummy 데이터
const testUser1: CreateUserDTO = {
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
    beforeEach(async () => {
      const user = await createTestUser(testUser1);
      const product1 = await createTestProduct({ ...testProduct1, authorId: user.id });
      const product2 = await createTestProduct({ ...testProduct2, authorId: user.id });
    });
    describe('정상적인 상품목록 조회', () => {
      test('쿼리 없이 조회 시 기본값에 맞게 조회됨', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(2);
        expect(response.body.totalCount).toBe(2);
        expect(response.body.list[0]).toMatchObject({
          name: testProduct1.name,
          price: testProduct1.price,
        });
        expect(response.body.list[0]).toHaveProperty('createdAt');
        expect(response.body.list[0]).toHaveProperty('id');
        expect(response.body.list[1]).toMatchObject({
          name: testProduct2.name,
          price: testProduct2.price,
        });
        expect(response.body.list[1]).toHaveProperty('createdAt');
        expect(response.body.list[1]).toHaveProperty('id');
      });
    });
  });
  // describe('GET /products/:id', () => {
  //   let product1;
  //   beforeEach(async () => {
  //     const user = await createTestUser(testUser1);
  //     product1 = await createTestProduct({ ...testProduct1, authorId: user.id });
  //   });
  //   describe('정상적인 상품 상세조회', () => {
  //     test('정상 작동', () => {
  //       // const response = await request(app).get(`/products/`)
  //     });
  //   });
  //   describe('상품 상세조회 오류', () => {});
  // });
  // describe('GET /products/:id/comments', () => {
  //   beforeEach(async () => {
  //     const user = await createTestUser(testUser1);
  //     const product1 = await createTestProduct({ ...testProduct1, authorId: user.id });
  //     await createTestProductComment({
  //       ...testProductComment1,
  //       authorId: user.id,
  //       productId: product1.id,
  //     });
  //     await createTestProductComment({
  //       ...testProductComment2,
  //       authorId: user.id,
  //       productId: product1.id,
  //     });
  //   });
  //   describe('정상적인 댓글 조회', () => {});
  //   describe('댓글 조회 오류', () => {});
  // });
});
// describe('인증 필요한 상품 API', () => {});
