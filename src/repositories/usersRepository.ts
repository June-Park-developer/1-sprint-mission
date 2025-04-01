import { prismaClient } from '../lib/prismaClient';
import { CreateUserInput, UpdateUserInput } from '../typings/userTypes';
import { Prisma } from '@prisma/client';

async function getByEmail(email: string) {
  return await prismaClient.user.findUnique({ where: { email } });
}

async function getByNickname(nickname: string) {
  return await prismaClient.user.findUnique({ where: { nickname } });
}

async function getById(id: number) {
  return await prismaClient.user.findUnique({ where: { id } });
}

async function create({ email, nickname, password }: Prisma.UserCreateInput) {
  const user = await prismaClient.user.create({
    data: { email, nickname, password },
  });
  return user;
}

async function update(id: number, data: UpdateUserInput) {
  return await prismaClient.user.update({
    where: { id },
    data,
  });
}

export default {
  getByEmail,
  getByNickname,
  getById,
  create,
  update,
};
