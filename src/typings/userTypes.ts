import { Infer } from 'superstruct';
import { PatchMyInfoBodyStruct } from '../structs/usersStructs';
import { Prisma } from '@prisma/client';
export type CreateUserInput = { email: string; nickname: string; hashedPassword: string };

export type UpdateUserInput = Prisma.UserUpdateInput;
