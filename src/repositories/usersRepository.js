import { prismaClient } from '../lib/prismaClient.js';

async function getByEmail(email) {
  return await prismaClient.user.findUnique({ where: { email } });
}

async function getByNickname(nickname) {
  return await prismaClient.user.findUnique({ where: { nickname } });
}

async function create({ email, nickname, hashedPassword }) {
  const user = await prismaClient.user.create({
    data: { email, nickname, password: hashedPassword },
  });
  return user;
}

async function updateRefreshToken(id, refreshToken) {
  return await prismaClient.user.update({
    where: { id },
    data: { refreshToken: refreshToken },
  });
}

export default {
  getByEmail,
  getByNickname,
  create,
  updateRefreshToken,
};
