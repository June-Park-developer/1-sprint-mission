import app from '../app';
import {
  clearTestDB,
  createTestArticle,
  createTestArticleComment,
  createTestUser,
  disconnectTestDB,
  getAuthenticatedAgent,
  likeArticleByUser,
} from '../lib/testUtils';
import request from 'supertest';
import { Article } from '../typings/articleTypes';
import { User } from '../typings/userTypes';
import { prismaClient } from '../lib/prismaClient';

describe('인증 필요하지 않은 게시글 API', () => {
  beforeEach(async () => {
    await clearTestDB();
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe('GET /articles', () => {
    beforeEach(async () => {
      const user1 = await createTestUser(testUser1);
      await createTestArticle({ ...testArticle1, authorId: user1.id });
      await createTestArticle({ ...testArticle2, authorId: user1.id });
    });
    describe('성공 게시글 목록 조회', () => {
      test('쿼리 없이 날렸을 때 isLiked 는 없어야 함', async () => {
        const response = await request(app).get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(2);
        expect(response.body.totalCount).toBe(2);
        expect(response.body.list[0]).toMatchObject(testArticle1);
        expect(response.body.list[0]).not.toHaveProperty('isLiked');
        expect(response.body.list[1]).toMatchObject(testArticle2);
        expect(response.body.list[1]).not.toHaveProperty('isLiked');
      });
      // Todo: 쿼리 테스트 필요
    });
  });
  describe('GET /articles/:id', () => {
    let article1: Article;
    beforeEach(async () => {
      const user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
    });
    describe('성공 게시글 상세 조회', () => {
      test('성공 조회', async () => {
        const response = await request(app).get(`/articles/${article1.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(testArticle1);
      });
    });
  });
  describe('GET /articles/:id/comments', () => {
    let article1: Article;
    beforeEach(async () => {
      const user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
      await createTestArticleComment({
        ...testArticleComment1,
        articleId: article1.id,
        authorId: user1.id,
      });
      await createTestArticleComment({
        ...testArticleComment2,
        articleId: article1.id,
        authorId: user1.id,
      });
    });
    describe('성공 댓글 목록 조회', () => {
      test('성공', async () => {
        const response = await request(app).get(`/articles/${article1.id}/comments`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(2);
        expect(response.body.nextCursor).toBe(null);
        expect(response.body.list[0]).toMatchObject(testArticleComment2);
        expect(response.body.list[1]).toMatchObject(testArticleComment1);
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
  describe('GET /articles', () => {
    let user1: User;
    let article1: Article;
    let article2: Article;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
      article2 = await createTestArticle({ ...testArticle2, authorId: user1.id });
      await likeArticleByUser(user1.id, article1.id);
    });
    describe('성공(로그인 상태)', () => {
      test('like 여부에 따라 isLiked 값이 다르게 반환되어야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.list[0]).toMatchObject({ title: article1.title, isLiked: true });
        expect(response.body.list[1]).toMatchObject({ title: article2.title, isLiked: false });
      });
    });
    describe('실패', () => {});
  });
  describe('POST /articles', () => {
    let user1: User;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
    });
    describe('성공(로그인 상태)', () => {
      test('로그인한 userId로 새로운 게시글을 생성하고 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post('/articles').send(testArticle1);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(testArticle1);
        expect(response.body.authorId).toBe(user1.id);
      });
    });
    describe('실패', () => {});
  });
  describe('GET /articles/:id', () => {
    let user1: User;
    let article1: Article;
    let article2: Article;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
      article2 = await createTestArticle({ ...testArticle2, authorId: user1.id });
      await likeArticleByUser(user1.id, article1.id);
    });
    describe('성공(로그인 상태)', () => {
      test('like 한 article은 isLiked=true 를 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.get(`/articles/${article1.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ isLiked: true });
      });
      test('like 하지 않은 article은 isLiked=false 를 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.get(`/articles/${article2.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ isLiked: false });
      });
    });
    describe('실패', () => {});
  });
  describe('PATCH /articles/:id', () => {
    let user1: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
    });
    describe('성공(로그인 + author)', () => {
      test('수정하고 수정 내용을 반영햐여 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent
          .patch(`/articles/${article1.id}`)
          .send({ title: '수정한 게시글' });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ title: '수정한 게시글' });
      });
    });
    describe('실패', () => {});
  });
  describe('DELETE /articles/:id', () => {
    let user1: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
    });
    describe('성공(로그인 + author)', () => {
      test('삭제 시 204 & 다시 조회 시 404 응답을 반환해야 함', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.delete(`/articles/${article1.id}`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/articles/${article1.id}`);
        expect(getResponse.status).toBe(404);
      });
    });
    describe('실패', () => {});
  });
  describe('POST /articles/:id/comments', () => {
    let user1: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
    });
    describe('성공(로그인 + author)', () => {
      test('201 응답으로 생성된 댓글을 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent
          .post(`/articles/${article1.id}/comments`)
          .send(testArticleComment1);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(testArticleComment1);
      });
    });
    describe('실패', () => {});
  });
  describe('POST /articles/:id/like', () => {
    let user1: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(testUser1);
      article1 = await createTestArticle({ ...testArticle1, authorId: user1.id });
    });
    describe('성공(로그인 + author)', () => {
      test('like 되지 않은 게시글은 like 되어 get 시 isLiked=true 여야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/articles/${article1.id}/like`);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Article liked successfully');
        const getResponse = await agent.get(`/articles/${article1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toMatchObject({ isLiked: true });
      });
      test('이미 like 된 게시글은 unliked 되어 get 시 isLiked=false 여야 함', async () => {
        await likeArticleByUser(user1.id, article1.id);
        const likeExists = await prismaClient.likedArticle.findFirst({
          where: { userId: user1.id, articleId: article1.id },
        });
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/articles/${article1.id}/like`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/articles/${article1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toMatchObject({ isLiked: false });
      });
    });
    describe('실패', () => {});
  });
});
