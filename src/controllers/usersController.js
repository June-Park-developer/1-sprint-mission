import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import {} from '../structs/commonStructs.js';
import {} from '../structs/usersStructs.js';
import usersRepository from '../repositories/usersRepository.js';
import bcrypt from 'bcrypt';
import {
  CreateUserBodyStruct,
  LoginUserBodyStruct,
  PatchMyInfoBodyStruct,
  PatchMyPasswordStruct,
} from '../structs/usersStructs.js';
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
    throw new NotFoundError('user', email);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Wrong Password');
  }
  const accessToken = createToken(user);
  const refreshToken = createToken(user, 'refresh');
  await usersRepository.update(user.id, { refreshToken });
  res.cookie('refreshToken', refreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ accessToken });
}

// 나의 정보 조회
export async function getMyInfo(req, res) {
  const { userId } = req.user;
  const user = await usersRepository.getById(userId);
  if (!user) {
    throw new NotFoundError('user', userId);
  }
  const filteredUser = filterSensitiveUserData(user);
  res.json(filteredUser);
}

// 나의 정보 수정
export async function patchMyInfo(req, res) {
  const data = create(req.body, PatchMyInfoBodyStruct);
  const { userId } = req.user;
  const user = await usersRepository.update(userId, data);
  if (!user) {
    throw new NotFoundError('user', userId);
  }
  const filteredUser = filterSensitiveUserData(user);
  res.json(filteredUser);
}

// 나의 비밀번호 수정
export async function patchMyPassword(req, res) {
  const { password } = create(req.body, PatchMyPasswordStruct);
  const { userId } = req.user;
  const hashedPassword = await hashPassword(password);
  const user = await usersRepository.update(userId, { password: hashedPassword });
  if (!user) {
    throw new NotFoundError('user', userId);
  }
  res.status(200).json({
    message: 'Password updated successfully',
  });
}

// Token Refresh : refreshToken 가져와서 검증을 한 다음에, 새로 createToken 한다음에 재발급
export async function refreshToken(req, res) {
  const { refreshToken } = req.cookies;
  const { userId } = req.auth;
  const user = await usersRepository.getById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Unauthorized');
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  await usersRepository.update(user.id, { refreshToken: newRefreshToken });
  res.cookie('refreshToken', newRefreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ accessToken: newAccessToken });
}
