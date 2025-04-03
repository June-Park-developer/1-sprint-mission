import { create } from 'superstruct';
import {
  CreateUserBodyStruct,
  LoginUserBodyStruct,
  PatchMyInfoBodyStruct,
  PatchMyPasswordStruct,
  GetLikedProductListParamsStruct,
} from '../structs/usersStructs';
import { RequestHandler } from 'express';
import {
  CreateUserDTO,
  GetMyInfoDTO,
  LoginUserDTO,
  PatchMyInfoDTO,
  UserResponseDTO,
} from '../DTO/usersDTO';
import usersService from '../services/usersService';
import { GetMyProductsParamsStruct } from '../structs/productsStruct';
import productsService from '../services/productsService';
import { GetMyLikedProductListDTO } from '../DTO/productsDTO';

export const createUser: RequestHandler = async (req, res) => {
  const { email, nickname, password } = create(req.body, CreateUserBodyStruct); // To-do : usersStructs
  const dto: CreateUserDTO = { email, nickname, password };
  const user: UserResponseDTO = await usersService.createUser(dto);
  res.status(201).send(user);
};

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
  res.cookie('accessToken', accessToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: 'Log In Success' });
};

export const getMyInfo: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const dto: GetMyInfoDTO = { userId };
  const user: UserResponseDTO = await usersService.getMyInfo(dto);
  res.json(user);
};

export const patchMyInfo: RequestHandler = async (req, res) => {
  const { email, nickname, image } = create(req.body, PatchMyInfoBodyStruct);
  const { userId } = req.user!;
  const dto: PatchMyInfoDTO = { userId, email, nickname, image };
  const user: UserResponseDTO = await usersService.patchMyInfo(dto);
  res.json(user);
};

export const patchMyPassword: RequestHandler = async (req, res) => {
  const { password } = create(req.body, PatchMyPasswordStruct);
  const { userId } = req.user!;
  const dto = { password, userId };
  await usersService.patchMyPassword(dto);
  res.status(200).json({
    message: 'Password updated successfully',
  });
};

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
  res.cookie('accessToken', accessToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: 'Tokens successfully refreshed' });
};

export const getMyProductList: RequestHandler = async (req, res) => {
  const { userId: authorId } = req.user!;
  const { page, pageSize, orderBy } = create(req.query, GetMyProductsParamsStruct);
  const dto = { authorId, page, pageSize, orderBy };
  const productList = await productsService.getMyProductList(dto);
  res.json(productList);
};

export const getMyLikedProductList: RequestHandler = async (req, res) => {
  const { userId } = req.user!;
  const { page, pageSize, orderBy } = create(req.query, GetLikedProductListParamsStruct);
  const dto: GetMyLikedProductListDTO = { userId, page, pageSize, orderBy };
  const productList = await productsService.getMyLikedProductList(dto);
  res.json(productList);
};
