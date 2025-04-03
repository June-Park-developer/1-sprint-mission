// Request
export interface CreateUserDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface GetMyInfoDTO {
  userId: number;
}

export interface PatchMyInfoDTO {
  userId: number;
  email?: string;
  nickname?: string;
  image?: string;
}

export interface PatchMyPasswordDTO {
  password: string;
  userId: number;
}

export interface RefreshTokenDTO {
  refreshToken: string;
  userId: number;
}

// Response
export interface UserResponseDTO {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenResponseDTO {
  refreshToken: string;
  accessToken: string;
}
