
import { HttpClient } from './http-client';
import { User, Role } from '../types';

interface GoogleLoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string; // Recibimos string para normalizar
    photo_url?: string;
  };
}

class AuthService extends HttpClient {
  async googleLogin(idToken: string): Promise<GoogleLoginResponse> {
    // URL especificada por el usuario: google_login
    return this.post<GoogleLoginResponse>('/google_login/', { token: idToken });
  }

  logout() {
    localStorage.removeItem('uapa_token');
    localStorage.removeItem('uapa_user');
  }

  saveSession(token: string, user: User) {
    localStorage.setItem('uapa_token', token);
    localStorage.setItem('uapa_user', JSON.stringify(user));
  }

  getSavedUser(): User | null {
    const saved = localStorage.getItem('uapa_user');
    return saved ? JSON.parse(saved) : null;
  }

  getSavedToken(): string | null {
    return localStorage.getItem('uapa_token');
  }
}

export const authService = new AuthService();
