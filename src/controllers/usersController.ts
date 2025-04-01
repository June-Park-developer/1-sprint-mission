import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import ConflictError from '../lib/errors/ConflictError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import {} from '../structs/commonStructs';
import {} from '../structs/usersStructs';
import usersRepository from '../repositories/usersRepository.js';
import likedProductsRepository from '../repositories/likedProductsRepository.js';
import bcrypt from 'bcrypt';
import {
  CreateUserBodyStruct,
  LoginUserBodyStruct,
  PatchMyInfoBodyStruct,
  PatchMyPasswordStruct,
  GetLikedProductListParamsStruct,
} from '../structs/usersStructs';
import jwt, { PrivateKey, Secret } from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/constants';
import { RequestHandler } from 'express';
import { User } from '@prisma/client';

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

function createToken(user: User, type?: string) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
    algorithm: 'HS256' as const,
  };
  if (JWT_SECRET) {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, options as jwt.SignOptions);
  }
}

export const createUser: RequestHandler = async (req, res) => {
  const { email, nickname, password: plainPassword } = create(req.body, CreateUserBodyStruct); // To-do : usersStructs
  const existingEmail = await usersRepository.getByEmail(email);
  const existingNickname = await usersRepository.getByNickname(nickname);
  if (existingEmail) {
    throw new ConflictError('Email');
  }
  if (existingNickname) {
    throw new ConflictError('Nickname');
  }
  const password = await hashPassword(plainPassword);
  const createdUser = await usersRepository.create({ email, nickname, password });
  const filteredUser = filterSensitiveUserData(createdUser);
  res.status(201).send(filteredUser);
};

// 토큰 기반 로그인
export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = create(req.body, LoginUserBodyStruct);
  const user = await usersRepository.getByEmail(email);
  if (!user) {
    throw new NotFoundError(`User with email ${email} is not found`);
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
};

// 나의 정보 조회
export const getMyInfo: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const user = await usersRepository.getById(userId);
  if (!user) {
    throw new NotFoundError(`User with id ${userId} is not found`);
  }
  const filteredUser = filterSensitiveUserData(user);
  res.json(filteredUser);
};

// 나의 정보 수정
export const patchMyInfo: RequestHandler = async (req, res) => {
  const data = create(req.body, PatchMyInfoBodyStruct);
  const { userId } = req.user!;
  const user = await usersRepository.update(userId, data);
  if (!user) {
    throw new NotFoundError(`User with id ${userId} is not found`);
  }
  const filteredUser = filterSensitiveUserData(user);
  res.json(filteredUser);
};

// 나의 비밀번호 수정
export const patchMyPassword: RequestHandler = async (req, res) => {
  const { password } = create(req.body, PatchMyPasswordStruct);
  const { userId } = req.user!;
  const hashedPassword = await hashPassword(password);
  const user = await usersRepository.update(userId, { password: hashedPassword });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} is not found`);
  }
  res.status(200).json({
    message: 'Password updated successfully',
  });
};

// Token Refresh : refreshToken 가져와서 검증을 한 다음에, 새로 createToken 한다음에 재발급
export const refreshToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { userId } = req.auth!;
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
};

export const getLikedProductList: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { page, pageSize, orderBy } = create(req.query, GetLikedProductListParamsStruct);
  const totalCount = await likedProductsRepository.countByUserId(userId);
  const likedProducts = await likedProductsRepository.getLikedProductList({
    userId,
    page,
    pageSize,
    orderBy,
  });
  res.json({ list: likedProducts, totalCount });
};
