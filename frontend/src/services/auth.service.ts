import { api } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token even if the request fails
      localStorage.removeItem('token');
      throw error;
    }
  }

  static async getUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  static async updateProfile(data: any): Promise<any> {
    try {
      const response = await api.put('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await api.put('/users/password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
} 