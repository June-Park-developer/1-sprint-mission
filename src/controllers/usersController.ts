import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import ConflictError from '../lib/errors/ConflictError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import {} from '../structs/commonStructs';
import {} from '../structs/usersStructs';
import usersRepository from '../repositories/usersRepository';
import likedProductsRepository from '../repositories/likedProductsRepository';
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
import {
  CreateUserDTO,
  GetMyInfoDTO,
  LoginUserDTO,
  PatchMyInfoDTO,
  UserResponseDTO,
} from '../DTO/usersDTO';
import usersService from '../services/usersService';

export const createUser: RequestHandler = async (req, res) => {
  const { email, nickname, password } = create(req.body, CreateUserBodyStruct); // To-do : usersStructs
  const dto: CreateUserDTO = { email, nickname, password };
  const user: UserResponseDTO = await usersService.createUser(dto);
  res.status(201).send(user);
};

// 토큰 기반 로그인
export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = create(req.body, LoginUserBodyStruct);
  const dto: LoginUserDTO = { email, password };
  const { accessToken, refreshToken } = await usersService.loginUser(dto);
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
  const dto: GetMyInfoDTO = { userId };
  const user: UserResponseDTO = await usersService.getMyInfo(dto);
  res.json(user);
};

// 나의 정보 수정
export const patchMyInfo: RequestHandler = async (req, res) => {
  const { email, nickname, image } = create(req.body, PatchMyInfoBodyStruct);
  const { userId } = req.user!;
  const dto: PatchMyInfoDTO = { userId, email, nickname, image };
  const user: UserResponseDTO = await usersService.patchMyInfo(dto);
  res.json(user);
};

// 나의 비밀번호 수정
export const patchMyPassword: RequestHandler = async (req, res) => {
  const { password } = create(req.body, PatchMyPasswordStruct);
  const { userId } = req.user!;
  const dto = { password, userId };
  await usersService.patchMyPassword(dto);
  res.status(200).json({
    message: 'Password updated successfully',
  });
};

// Token Refresh : refreshToken 가져와서 검증을 한 다음에, 새로 createToken 한다음에 재발급
export const refreshToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { userId } = req.auth!;
  const dto = { refreshToken, userId };
  const { refreshToken: newRefreshToken, accessToken } = await usersService.refreshToken(dto);
  res.cookie('refreshToken', newRefreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ accessToken });
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
