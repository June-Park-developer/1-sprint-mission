import app from '../app';
import request from 'supertest';
import { prismaClient } from '../lib/prismaClient';
import { clearTestDB, createTestUser } from '../lib/testUtils';

// 더미 데이터
const testUser1 = {
  email: 'test@example.com',
  nickname: 'testUser1',
  password: 'password1234',
};

describe('로그인 테스트', () => {
  beforeEach(async () => {
    await clearTestDB();
    await createTestUser(testUser1);
  });
  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  test('POST /users/login', async () => {
    const user = await request(app)
      .post('/users/login')
      .send({ email: testUser1.email, password: testUser1.password });
    expect(user.status).toBe(200);
    expect(user.body.message).toBe('Log In Success');
    expect(user.headers['set-cookie']).toBeTruthy();
  });
});
