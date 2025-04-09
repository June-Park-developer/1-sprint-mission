import { prismaClient } from '../lib/prismaClient';
import { User } from '../typings/userTypes';
import { Prisma } from '@prisma/client';

export async function getByEmail(email: string): Promise<User | null> {
  return await prismaClient.user.findUnique({ where: { email } });
}

export async function getByNickname(nickname: string): Promise<User | null> {
  return await prismaClient.user.findUnique({ where: { nickname } });
}

export async function getById(id: number): Promise<User | null> {
  return await prismaClient.user.findUnique({ where: { id } });
}

export async function create({ email, nickname, password }: Prisma.UserCreateInput): Promise<User> {
  const user = await prismaClient.user.create({
    data: { email, nickname, password },
  });
  return user;
}

export async function update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
  return await prismaClient.user.update({
    where: { id },
    data,
  });
}
