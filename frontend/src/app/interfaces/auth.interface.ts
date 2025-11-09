export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  roles?: string[];
}

export interface AuthResponse {
  id: string;
  username: string;
  roles: string[];
  balance: number;
  isActive: boolean;
  token: string;
}

