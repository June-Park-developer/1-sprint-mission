import app from '../app';
import {
  clearTestDB,
  createMultipleTestArticleComments,
  createMultipleTestArticles,
  createTestArticle,
  createTestUser,
  disconnectTestDB,
  getAuthenticatedAgent,
  likeArticleByUser,
} from '../lib/testUtils';
import request from 'supertest';
import { Article } from '../typings/articleTypes';
import { User } from '../typings/userTypes';
import http from 'http';
import * as websocket from '../websocket/setupWebSocket';
import { createAccessTokenWithUserId } from '../lib/auth/jwt';
import { setupWebSocket } from '../websocket/setupWebSocket';
import Client, { Socket } from 'socket.io-client';
import { Server as ioServer } from 'socket.io';

describe('인증 필요하지 않은 게시글 API', () => {
  let user1Id: number;
  let article1: Article;
  beforeAll(async () => {
    await clearTestDB();
    const user1 = await createTestUser(1);
    user1Id = user1.id;
    const articles = await createMultipleTestArticles(user1Id, 30);
    article1 = articles[0];
    await createMultipleTestArticleComments(article1.id, user1Id, 30);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe('GET /articles', () => {
    describe('성공 게시글 목록 조회', () => {
      test('기본동작 : page=1, pageSize=10, 아이디 오름차순, isLiked 없음', async () => {
        const response = await request(app).get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.totalCount).toBe(30);
        const list: Article[] = response.body.list;
        for (let i = 0; i < list.length - 1; i++) {
          expect(list[i].id).toBeLessThan(list[i + 1].id);
        }
        for (const article of list) {
          expect(article).not.toHaveProperty('isLiked');
        }
      });
      test('쿼리 orderBy=recent : 최신 순으로 정렬 가능', async () => {
        const response = await request(app).get('/articles?orderBy=recent');
        expect(response.status).toBe(200);
        const list: Article[] = response.body.list;
        for (let i = 0; i < list.length - 1; i++) {
          const formerDate = new Date(list[i].createdAt).getTime();
          const latterDate = new Date(list[i + 1].createdAt).getTime();
          expect(formerDate).toBeGreaterThan(latterDate);
        }
      });
      test('쿼리 keyword : title, content에 포함된 단어로 검색가능', async () => {
        const keyword = '게시글 1';
        const response = await request(app).get(`/articles?keyword=${keyword}`);
        const list: Article[] = response.body.list;
        expect(response.status).toBe(200);
        expect(
          list.every(
            (article) => article.title.includes(keyword) || article.content.includes(keyword),
          ),
        ).toBe(true);
      });
      test('쿼리 pageSize : pageSize 만큼 잘려서 내려옴', async () => {
        const pageSize = 5;
        const response = await request(app).get(`/articles?pageSize=${pageSize}`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(pageSize);
        expect(response.body.totalCount).toBe(30);
      });
      test('쿼리 page : page1의 첫번째는 상품 1, page2의 첫번째는 상품 11이어야 함', async () => {
        const response1 = await request(app).get(`/articles?page=1`);
        expect(response1.status).toBe(200);
        expect(response1.body.list[0].title).toBe('게시글 1');
        const response2 = await request(app).get(`/articles?page=2`);
        expect(response2.status).toBe(200);
        expect(response2.body.list[0].title).toBe('게시글 11');
      });
    });
  });
  describe('GET /articles/:id', () => {
    describe('성공 게시글 상세 조회', () => {
      test('정상 작동 : 해당 아이디의 상품이 상세 조회되고 isLiked 는 없음', async () => {
        const response = await request(app).get(`/articles/${article1.id}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(article1.title);
        expect(response.body).not.toHaveProperty('isLiked');
      });
    });
    describe('오류', () => {
      test('존재하지 않는 게시글 ID로 요청 시 404 응답', async () => {
        const response = await request(app).get('/articles/999999');
        expect(response.status).toBe(404);
      });
    });
  });
  describe('GET /articles/:id/comments', () => {
    describe('성공 댓글 목록 조회', () => {
      let nextCursor = 0;
      test('기본작동: cursor 없으면 첫번째부터 limit=10', async () => {
        const response = await request(app).get(`/articles/${article1.id}/comments`);
        expect(response.status).toBe(200);
        expect(response.body.list.length).toBe(10);
        expect(response.body.nextCursor).not.toBeNull();
        nextCursor = response.body.nextCursor;
      });
      test('쿼리 cursor: 커서부터 limit개 가져오기', async () => {
        const response = await request(app).get(
          `/articles/${article1.id}/comments?cursor=${nextCursor}`,
        );
        expect(response.status).toBe(200);
        expect(response.body.list[0].id).toBe(nextCursor);
        expect(response.body.list.length).toBe(10);
      });
    });
    describe('댓글 조회 오류', () => {
      test('존재하지 않는 상품 ID로 댓글목록 요청 시 404 응답', async () => {
        const response = await request(app).get('/articles/999999');
        expect(response.status).toBe(404);
      });
    });
  });
});

describe('인증 필요한 게시글 API', () => {
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
      user1 = await createTestUser(1);
      const articles = await createMultipleTestArticles(user1.id, 30);
      article1 = articles[0];
      article2 = articles[1];
      await likeArticleByUser(user1.id, article1.id); // article1 만 like 되어 있음
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
  });
  describe('POST /articles', () => {
    let user1: User;
    beforeEach(async () => {
      user1 = await createTestUser(1);
    });
    describe('성공(로그인 상태)', () => {
      test('로그인한 userId로 새로운 게시글을 생성하고 반환해야 함', async () => {
        const newArticle = {
          title: '새로운 게시글',
          content: '새로운 게시글의 내용',
          image: 'https://example.com/image.jpg',
        };
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post('/articles').send(newArticle);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newArticle);
        expect(response.body.authorId).toBe(user1.id);
      });
    });
    describe('실패', () => {
      test('잘못된 정보를 넣으면 400 에러를 반환해야 함', async () => {
        const wrongArticle = {
          title: '잘못된 게시글',
        };
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post('/articles').send(wrongArticle);
        expect(response.status).toBe(400);
      });
    });
  });
  describe('GET /articles/:id', () => {
    let user1: User;
    let article1: Article;
    let article2: Article;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      const articles = await createMultipleTestArticles(user1.id, 2);
      article1 = articles[0];
      article2 = articles[1];
      await likeArticleByUser(user1.id, article1.id); // article1만 like 되어 있음
    });
    describe('성공(로그인 상태)', () => {
      test('like 한 article은 isLiked=true 를 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.get(`/articles/${article1.id}`);
        expect(response.status).toBe(200);
        expect(response.body.isLiked).toBe(true);
      });
      test('like 하지 않은 article은 isLiked=false 를 포함해서 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.get(`/articles/${article2.id}`);
        expect(response.status).toBe(200);
        expect(response.body.isLiked).toBe(false);
      });
    });
  });
  describe('PATCH /articles/:id', () => {
    let user1: User;
    let user2: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      user2 = await createTestUser(2);
      article1 = await createTestArticle(user1.id); // user1 이 생성한 게시글
    });
    describe('성공(로그인 + author)', () => {
      test('수정하고 수정 내용을 반영햐여 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent
          .patch(`/articles/${article1.id}`)
          .send({ title: '수정한 게시글' });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('수정한 게시글');
      });
    });
    describe('오류', () => {
      test('author가 아닌 사람이 요청 시 403 오류를 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user2.id);
        const response = await agent
          .patch(`/articles/${article1.id}`)
          .send({ title: '수정한 게시글' });
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You do not have permission to access this resource.');
      });
    });
  });
  describe('DELETE /articles/:id', () => {
    let user1: User;
    let user2: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      user2 = await createTestUser(2);
      article1 = await createTestArticle(user1.id); // user1 이 생성한 게시글
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
    describe('오류', () => {
      test('author가 아닌 사람이 요청 시 403 오류를 반환해야 함', async () => {
        const agent = getAuthenticatedAgent(user2.id);
        const response = await agent.delete(`/articles/${article1.id}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You do not have permission to access this resource.');
      });
    });
  });
  describe('POST /articles/:id/comments', () => {
    let user1: User;
    let user2: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      user2 = await createTestUser(2);
      article1 = await createTestArticle(user1.id); // user1 이 생성한 게시글
    });
    describe('성공(로그인 + author)', () => {
      let server: http.Server;
      let ioServer: ioServer;
      let clientSocket: Socket;
      beforeEach((done) => {
        server = http.createServer(app);
        ioServer = setupWebSocket(server);
        const getIoSpy = jest.spyOn(websocket, 'getIo').mockReturnValue(ioServer); // 테스트용 ioServer를 반환하도록 스파이함
        server.listen(() => {
          const port = (server.address() as any).port;
          clientSocket = Client(`http://localhost:${port}`, {
            auth: {
              accessToken: createAccessTokenWithUserId(user1.id),
            },
          });
          clientSocket.on('connect', done);
        });
      });

      afterAll(() => {
        clientSocket.close();
        ioServer.close();
        server.close();
      });
      test('201 응답으로 생성된 댓글을 반환해야 하고, 게시글 작성자에게 실시간 알림', async () => {
        const notificationPromise = new Promise((resolve) => {
          clientSocket.once('notification', resolve);
        });
        const newComment = {
          content: '새로운 댓글',
        };
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/articles/${article1.id}/comments`).send(newComment);

        const notification = await notificationPromise;
        expect(notification).toMatchObject({
          articleId: article1.id,
        });
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
          .post(`/articles/${article1.id}/comments`)
          .send(newComment);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No authorization token was found');
      });
      // 추가로 : 잘못된 comment 넣었을 때, 없는 articleId 에 달려고 할때 등등..
    });
  });
  describe('POST /articles/:id/like', () => {
    let user1: User;
    let article1: Article;
    beforeEach(async () => {
      user1 = await createTestUser(1);
      article1 = await createTestArticle(user1.id);
    });
    describe('성공(로그인 + author)', () => {
      test('like 되지 않은 게시글은 like 되어 get 시 isLiked=true 여야 함', async () => {
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/articles/${article1.id}/like`);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Article liked successfully');
        const getResponse = await agent.get(`/articles/${article1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.isLiked).toBe(true);
      });
      test('이미 like 된 게시글은 unliked 되어 get 시 isLiked=false 여야 함', async () => {
        await likeArticleByUser(user1.id, article1.id); // 이미 like 됨
        const agent = getAuthenticatedAgent(user1.id);
        const response = await agent.post(`/articles/${article1.id}/like`);
        expect(response.status).toBe(204);
        const getResponse = await agent.get(`/articles/${article1.id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.isLiked).toBe(false);
      });
    });
    describe('오류', () => {
      test('로그인 되지 않은 경우 401 에러를 반환해야 함', async () => {
        const response = await request(app).post(`/articles/${article1.id}/like`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No authorization token was found');
      });
    });
  });
});
