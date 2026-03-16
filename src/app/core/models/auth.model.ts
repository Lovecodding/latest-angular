export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserInfo;
  expiresIn: number;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
