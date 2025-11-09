import apiService from '../api.service';
import { LoginDto, RegisterDto, AuthResponse } from '../../interfaces/auth.interface';

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  logout(): void {
    localStorage.removeItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};

