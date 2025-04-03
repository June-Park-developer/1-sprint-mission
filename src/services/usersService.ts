import bcrypt from 'bcrypt';
import { User } from '../typings/userTypes';
import { JWT_SECRET } from '../lib/constants';
import jwt from 'jsonwebtoken';
import {
  CreateUserDTO,
  GetMyInfoDTO,
  LoginUserDTO,
  PatchMyInfoDTO,
  PatchMyPasswordDTO,
  RefreshTokenDTO,
  TokenResponseDTO,
  UserResponseDTO,
} from '../DTO/usersDTO';
import usersRepository from '../repositories/usersRepository';
import ConflictError from '../lib/errors/ConflictError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

// Functions
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

  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options as jwt.SignOptions);
}

// Services

const createUser = async (dto: CreateUserDTO) => {
  const { email, nickname, password: plainPassword } = dto;
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
  const filteredUser: UserResponseDTO = filterSensitiveUserData(createdUser);
  return filteredUser;
};

const loginUser = async (dto: LoginUserDTO) => {
  const { email, password } = dto;
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
  const tokenResponse: TokenResponseDTO = { accessToken, refreshToken };
  return tokenResponse;
};

const getMyInfo = async (dto: GetMyInfoDTO) => {
  const { userId } = dto;
  const user = await usersRepository.getById(userId);
  if (!user) {
    throw new NotFoundError(`User with id ${userId} is not found`);
  }
  const userResponse: UserResponseDTO = filterSensitiveUserData(user);
  return userResponse;
};

const patchMyInfo = async (dto: PatchMyInfoDTO) => {
  const { userId, ...data } = dto;
  const user = await usersRepository.update(userId, data);
  if (!user) {
    throw new NotFoundError(`User with id ${userId} is not found`);
  }
  const userResponse: UserResponseDTO = filterSensitiveUserData(user);
  return userResponse;
};

const patchMyPassword = async (dto: PatchMyPasswordDTO) => {
  const { userId, password } = dto;
  const hashedPassword = await hashPassword(password);
  const user = await usersRepository.update(userId, { password: hashedPassword });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} is not found`);
  }
};

const refreshToken = async (dto: RefreshTokenDTO) => {
  const { userId, refreshToken } = dto;
  const user = await usersRepository.getById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Unauthorized');
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  await usersRepository.update(user.id, { refreshToken: newRefreshToken });
  const tokenResponse: TokenResponseDTO = {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
  return tokenResponse;
};
export default { createUser, loginUser, getMyInfo, patchMyInfo, patchMyPassword, refreshToken };
