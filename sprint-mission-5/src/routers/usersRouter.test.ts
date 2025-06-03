import app from '../app';
import request from 'supertest';
import { prismaClient } from '../lib/prismaClient';
import { clearTestDB, createTestUser } from '../lib/testUtils';
import { User } from '../typings/userTypes';

describe('로그인 테스트', () => {
  beforeEach(async () => {
    await clearTestDB();
    await createTestUser(1);
  });
  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  test('POST /users/login', async () => {
    const user = await request(app)
      .post('/users/login')
      .send({ email: `testuser1@example.com`, password: 'password1234' });
    expect(user.status).toBe(200);
    expect(user.body.message).toBe('Log In Success');
    expect(user.headers['set-cookie']).toBeTruthy();
  });
});
