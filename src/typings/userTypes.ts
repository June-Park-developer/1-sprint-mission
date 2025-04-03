import { Infer } from 'superstruct';
import { PatchMyInfoBodyStruct } from '../structs/usersStructs';
import { Prisma } from '@prisma/client';

// Entity
export interface User {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  password: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Input
export type CreateUserInput = { email: string; nickname: string; hashedPassword: string };
export type UpdateUserInput = Prisma.UserUpdateInput;
