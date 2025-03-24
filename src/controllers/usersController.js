import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import {} from '../structs/commonStructs.js';
import {} from '../structs/usersStructs.js';
import usersRepository from '../repositories/usersRepository.js';
import bcrypt from 'bcrypt';
import { CreateUserBodyStruct, LoginUserBodyStruct } from '../structs/usersStructs.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants.js';

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

function createToken(user, type) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export async function createUser(req, res) {
  const { email, nickname, password } = create(req.body, CreateUserBodyStruct); // To-do : usersStructs
  const existingEmail = await usersRepository.getByEmail(email);
  const existingNickname = await usersRepository.getByNickname(nickname);
  if (existingEmail) {
    throw new ConflictError('Email');
  }
  if (existingNickname) {
    throw new ConflictError('Nickname');
  }
  const hashedPassword = await hashPassword(password);
  const createdUser = await usersRepository.create({ email, nickname, hashedPassword });
  const filteredUser = filterSensitiveUserData(createdUser);
  res.status(201).send(filteredUser);
}

// 토큰 기반 로그인
export async function loginUser(req, res) {
  const { email, password } = create(req.body, LoginUserBodyStruct);
  const user = await usersRepository.getByEmail(email);
  if (!user) {
    throw new NotFoundError(user, email);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Wrong Password');
  }
  const accessToken = createToken(user);
  const refreshToken = createToken(user, 'refresh');
  await usersRepository.updateRefreshToken(user.id, refreshToken);
  res.cookie('refreshToken', refreshToken, {
    path: '/token/refresh',
    httpOnly: true,
    sameSite: 'none', // ? : 이거 옵션 설정 어떻게 하는지..?
    secure: true,
  });
  res.json({ accessToken });
}
