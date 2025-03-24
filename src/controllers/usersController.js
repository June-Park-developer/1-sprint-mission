import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import {} from '../structs/commonStructs.js';
import {} from '../structs/usersStructs.js';
import usersRepository from '../repositories/usersRepository.js';
import bcrypt from 'bcrypt';
import { CreateUserBodyStruct } from '../structs/usersStructs.js';

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
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
