import app from '../app';
import {
  createTestUser,
  createTestProduct,
  createTestProductComment,
  clearTestDB,
  disconnectTestDB,
  likeProductByUser,
  getAuthenticatedAgent,
} from '../lib/testUtils';
import request from 'supertest';
import { Product } from '../typings/productTypes';
import { User } from '../typings/userTypes';

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
        expect(response.body.list[0]).not.toHaveProperty('isLiked');
        expect(response.body.list[1]).toMatchObject({
          name: product2.name,
          price: product2.price,
          id: product2.id,
        });
        expect(response.body.list[0]).not.toHaveProperty('isLiked');
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

describe('인증 필요한 상품 API', () => {
  beforeEach(async () => {
    await clearTestDB();
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe('GET /products/', () => {
    let user1: User;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      const product1 = await createTestProduct({ ...testProduct1, authorId: user1.id });
      await createTestProduct({ ...testProduct2, authorId: user1.id });
      await likeProductByUser(user1.id, product1.id);
    });
    describe('정상', () => {
      test('로그인 후 조회 시 isLiked도 확인되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({ isLiked: true });
        expect(response.body.list[1]).toMatchObject({ isLiked: false });
      });
    });
    // describe('오류', () => {});
  });
  describe('POST /products', () => {
    let user1: User;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
    });
    describe('정상', () => {
      test('로그인 했다면 생성이 잘 되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post('/products').send(testProduct1);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(testProduct1);
        expect(response.body.authorId).toBe(user1.id);
      });
    });
    describe('오류', () => {});
  });
  describe('GET /products/:id', () => {
    let user1: User;
    let product1: Product;
    let product2: Product;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user1.id });
      product2 = await createTestProduct({ ...testProduct2, authorId: user1.id });
      await likeProductByUser(user1.id, product1.id);
    });
    describe('정상', () => {
      test('로그인 했다면 isLiked 도 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const likeResponse = await agent.get(`/products/${product1.id}`);
        expect(likeResponse.status).toBe(200);
        expect(likeResponse.body).toMatchObject({ isLiked: true });
        const NoLikeResponse = await agent.get(`/products/${product2.id}`);
        expect(NoLikeResponse.status).toBe(200);
        expect(NoLikeResponse.body).toMatchObject({ isLiked: false });
      });
    });
    describe('오류', () => {});
  });
  describe('PATCH /products/:id', () => {
    let user1: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user1.id });
    });
    describe('정상', () => {
      test('로그인 했고 자신이 생성한 상품이라면 수정되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent
          .patch(`/products/${product1.id}`)
          .send({ name: '수정한 상품' });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ name: '수정한 상품' });
      });
    });
    describe('오류', () => {});
  });
  describe('DELETE /products/:id', () => {
    let user1: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user1.id });
    });
    describe('정상', () => {
      test('로그인 했고 자신이 생성한 상품이라면 삭제되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.delete(`/products/${product1.id}`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/products/${product1.id}`);
        expect(getResponse.status).toBe(404);
      });
    });
    describe('오류', () => {});
  });
  describe('POST /products/:id/comments', () => {
    let user1: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user1.id });
    });
    describe('정상', () => {
      test('로그인 했다면 댓글이 생성 되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent
          .post(`/products/${product1.id}/comments`)
          .send(testProductComment1);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(testProductComment1);
      });
    });
    describe('오류', () => {});
  });
  describe('POST /products/:id/like', () => {
    let user1: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      product1 = await createTestProduct({ ...testProduct1, authorId: user1.id });
    });
    describe('정상 (로그인 상태)', () => {
      test('like 되지 않은 상품은 like 되어 get 시 isLiked=true 여야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/products/${product1.id}/like`);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Product liked successfully');
        const getResponse = await agent.get(`/products/${product1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toMatchObject({ isLiked: true });
      });
      test('like 된 상품은 unliked 되어 get 시 isLiked=false 여야 함', async () => {
        await likeProductByUser(user1.id, product1.id);
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/products/${product1.id}/like`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/products/${product1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toMatchObject({ isLiked: false });
      });
    });
    describe('오류', () => {});
  });
});
