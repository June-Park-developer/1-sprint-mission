import app from '../app';
import {
  createTestUser,
  createTestProduct,
  clearTestDB,
  disconnectTestDB,
  likeProductByUser,
  getAuthenticatedAgent,
  createMultipleTestProducts,
  createMultipleTestProductComments,
} from '../lib/testUtils';
import request from 'supertest';
import { Product } from '../typings/productTypes';
import { User } from '../typings/userTypes';
import { Comment } from '../typings/commentTypes';

// 테스트 코드

describe('인증 필요하지 않은 상품 API', () => {
  let user1Id: number;
  let product1: Product;
  let comment1: Comment;
  let comment2: Comment;
  let comment11: Comment;
  beforeAll(async () => {
    await clearTestDB();
    const user1 = await createTestUser(1);
    user1Id = user1.id;
    const products = await createMultipleTestProducts(user1Id, 30);
    product1 = products[0];
    const comments = await createMultipleTestProductComments(product1.id, user1Id, 30);
    comment1 = comments[0];
    comment2 = comments[1];
    comment11 = comments[10];
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe('GET /products', () => {
    describe('정상적인 상품목록 조회', () => {
      test('기본동작 : page=1, pageSize=10, 아이디 오름차순, isLiked 없음', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(30);
        const list: Product[] = response.body.list;
        for (let i = 0; i < list.length - 1; i++) {
          expect(list[i].id).toBeLessThan(list[i + 1].id);
        }
        for (const product of list) {
          expect(product).not.toHaveProperty('isLiked');
        }
      });
      test('쿼리 orderBy=recent : 최신 순으로 정렬 가능', async () => {
        const response = await request(app).get('/products?orderBy=recent');
        expect(response.status).toBe(200);
        const list: Product[] = response.body.list;
        for (let i = 0; i < list.length - 1; i++) {
          const formerDate = new Date(list[i].createdAt).getTime();
          const latterDate = new Date(list[i + 1].createdAt).getTime();
          expect(formerDate).toBeGreaterThan(latterDate);
        }
      });
      test('쿼리 keyword : name, description에 포함된 단어로 검색가능', async () => {
        const keyword = 'Product1';
        const response = await request(app).get(`/products?keyword=${keyword}`);
        const list: Product[] = response.body.list;
        expect(response.status).toBe(200);
        expect(
          list.every((item) => item.name.includes(keyword) || item.description.includes(keyword)),
        ).toBe(true);
      });
      test('쿼리 pageSize : pageSize 만큼 잘려서 내려옴', async () => {
        const pageSize = 5;
        const response = await request(app).get(`/products?pageSize=${pageSize}`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(pageSize);
        expect(response.body.totalCount).toBe(30);
      });
      test('쿼리 page : page1의 첫번째는 상품 1, page2의 첫번째는 상품 11이어야 함', async () => {
        const response1 = await request(app).get(`/products?page=1`);
        expect(response1.status).toBe(200);
        expect(response1.body.list[0].name).toBe('상품 1');
        const response2 = await request(app).get(`/products?page=2`);
        expect(response2.status).toBe(200);
        expect(response2.body.list[0].name).toBe('상품 11');
      });
    });
  });
  describe('GET /products/:id', () => {
    describe('정상적인 상품 상세조회', () => {
      test('정상 작동 : 해당 아이디의 상품이 상세 조회되고 isLiked 는 없음', async () => {
        const response = await request(app).get(`/products/${product1.id}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(product1.name);
        expect(response.body).not.toHaveProperty('isLiked');
      });
    });
    describe('오류', () => {
      test('존재하지 않는 상품 ID 요청 시 404 응답', async () => {
        const response = await request(app).get('/products/999999');
        expect(response.status).toBe(404);
      });
    });
  });
  describe('GET /products/:id/comments', () => {
    describe('정상', () => {
      let nextCursor = 0;
      test('기본작동: cursor 없으면 첫번째부터 limit=10', async () => {
        const response = await request(app).get(`/products/${product1.id}/comments`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        nextCursor = response.body.nextCursor;
      });
      test('쿼리 cursor: 커서부터 limit개 가져오기', async () => {
        const response = await request(app).get(
          `/products/${product1.id}/comments?cursor=${nextCursor}`,
        );
        expect(response.status).toBe(200);
        expect(response.body.list[0].id).toBe(nextCursor);
        expect(response.body.list.length).toBe(10);
      });
    });
    describe('댓글 조회 오류', () => {
      test('존재하지 않는 상품 ID로 댓글목록 요청 시 404 응답', async () => {
        const response = await request(app).get('/products/999999');
        expect(response.status).toBe(404);
      });
    });
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
    let user1Id: number;
    let product1: Product;
    let product2: Product;
    beforeEach(async () => {
      const user1 = await createTestUser(1);
      user1Id = user1.id;
      const products = await createMultipleTestProducts(user1Id, 30);
      product1 = products[0];
      product2 = products[1];
      await likeProductByUser(user1Id, product1.id); // product1 만 like 되어 있음
    });
    describe('성공(로그인 상태)', () => {
      test('like 여부에 따라 isLiked 값이 다르게 반환되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1Id);
        const response = await agent.get('/products');
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({ id: product1.id, isLiked: true });
        expect(response.body.list[1]).toMatchObject({ id: product2.id, isLiked: false });
      });
    });
  });
  describe('POST /products', () => {
    let user1Id: number;
    beforeEach(async () => {
      const user1 = await createTestUser(1);
      user1Id = user1.id;
    });
    describe('정상', () => {
      test('로그인한 userId로 새로운 상품을 생성하고 반환해야 함', async () => {
        const newProduct = {
          name: '새로운 상품',
          price: 1000,
          description: '새로운 설명',
          tags: [],
          images: [],
        };
        const agent = getAuthenticatedAgent(user1Id);
        const response = await agent.post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newProduct);
        expect(response.body.authorId).toBe(user1Id);
      });
    });
    describe('오류', () => {
      test('잘못된 정보를 넣으면 400 에러를 반환해야 함', async () => {
        const wrongProduct = {
          price: 1000,
        };
        const agent = getAuthenticatedAgent(user1Id);
        const response = await agent.post('/products').send(wrongProduct);
        expect(response.status).toBe(400);
      });
    });
  });
  describe('GET /products/:id', () => {
    let user1Id: number;
    let product1: Product;
    let product2: Product;
    beforeEach(async () => {
      const user1 = await createTestUser(1);
      user1Id = user1.id;
      const products = await createMultipleTestProducts(user1Id, 2);
      product1 = products[0];
      product2 = products[1];
      await likeProductByUser(user1Id, product1.id); // product1 만 like 되어 있음
    });
    describe('정상 (로그인 시)', () => {
      test('like 한 product는 isLiked=true 를 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1Id);
        const response = await agent.get(`/products/${product1.id}`);
        expect(response.status).toBe(200);
        expect(response.body.isLiked).toBe(true);
      });
      test('like 하지 않은 product는 isLiked=false 를 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1Id);
        const response = await agent.get(`/products/${product2.id}`);
        expect(response.status).toBe(200);
        expect(response.body.isLiked).toBe(false);
      });
    });
  });
  describe('PATCH /products/:id', () => {
    let user1: User;
    let user2: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      user2 = await createTestUser(2);
      product1 = await createTestProduct(user1.id); // user1 이 생성한 상품
    });
    describe('성공(로그인 + author)', () => {
      test('수정하고 수정 내용을 반영햐여 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent
          .patch(`/products/${product1.id}`)
          .send({ name: '수정한 상품' });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('수정한 상품');
      });
    });
    describe('오류', () => {
      test('author가 아닌 사람이 요청 시 403 오류를 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user2.id);
        const response = await agent
          .patch(`/products/${product1.id}`)
          .send({ name: '수정한 상품' });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You do not have permission to access this resource.');
      });
    });
  });
  describe('DELETE /products/:id', () => {
    let user1: User;
    let user2: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      user2 = await createTestUser(2);
      product1 = await createTestProduct(user1.id); // user1 이 만든 상품
    });
    describe('성공(로그인 + author)', () => {
      test('삭제 시 204 & 다시 조회 시 404 응답을 반환해야 함', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.delete(`/products/${product1.id}`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/products/${product1.id}`);
        expect(getResponse.status).toBe(404);
      });
    });
    describe('오류', () => {
      test('author가 아닌 사람이 요청 시 403 오류를 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user2.id);
        const response = await agent
          .delete(`/products/${product1.id}`)
          .send({ name: '수정한 상품' });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You do not have permission to access this resource.');
      });
    });
  });
  describe('POST /products/:id/comments', () => {
    let user1: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      product1 = await createTestProduct(user1.id);
    });
    describe('정상', () => {
      test('로그인 했다면 댓글이 생성 되어야 함', async () => {
        const newComment = {
          content: '새로운 댓글',
        };
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/products/${product1.id}/comments`).send(newComment);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newComment);
      });
    });
    describe('오류', () => {
      test('로그인 하지 않았다면 401 에러가 반환되어야 함', async () => {
        const newComment = {
          content: '새로운 댓글',
        };
        const response = await request(app)
          .post(`/products/${product1.id}/comments`)
          .send(newComment);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No authorization token was found');
      });
      // 추가로 : 잘못된 comment 넣었을 때, 없는 productId 에 달려고 할때 등등..
    });
  });

  describe('POST /products/:id/like', () => {
    let user1: User;
    let product1: Product;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      product1 = await createTestProduct(user1.id);
    });
    describe('정상 (로그인 상태)', () => {
      test('like 되지 않은 상품은 like 되어 get 시 isLiked=true 여야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/products/${product1.id}/like`);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Product liked successfully');
        const getResponse = await agent.get(`/products/${product1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.isLiked).toBe(true);
      });
      test('이미 like 된 상품은 unliked 되어 get 시 isLiked=false 여야 함', async () => {
        await likeProductByUser(user1.id, product1.id);
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/products/${product1.id}/like`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/products/${product1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.isLiked).toBe(false);
      });
    });
    describe('오류', () => {
      test('로그인 되지 않은 경우 401 에러를 반환해야 함', async () => {
        const response = await request(app).post(`/products/${product1.id}/like`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No authorization token was found');
      });
    });
  });
});
