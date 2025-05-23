import app from '../app';
import {
  clearTestDB,
  createTestArticle,
  createTestArticleComment,
  createTestUser,
  disconnectTestDB,
} from '../lib/testUtils';
import request from 'supertest';
import { Article } from '../typings/articleTypes';

// 더미 데이터
const testUser1 = {
  email: 'test@example.com',
  nickname: 'testUser1',
  password: 'password1234',
};

const testArticle1 = {
  title: '테스트 게시물 1',
  content: '테스트 게시물 설명 1',
  image: 'article1.png',
};
const testArticle2 = {
  title: '테스트 게시물 2',
  content: '테스트 게시물 설명 2',
  image: 'article2.png',
};

const testArticleComment1 = {
  content: '테스트 게시물 댓글 1',
};
const testArticleComment2 = {
  content: '테스트 게시물 댓글 2',
};

// 테스트 코드
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
    describe('정상 게시글 목록 조회', () => {
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
    describe('정상 게시글 상세 조회', () => {
      test('정상 조회', async () => {
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
    describe('정상 댓글 목록 조회', () => {
      test('정상', async () => {
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
// describe('인증 필요한 상품 API', () => {});
