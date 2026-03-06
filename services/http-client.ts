import { API_BASE_URL } from '../config';
export class HttpClient {
  // URL base institucional por defecto
  protected baseUrl: string = `${API_BASE_URL}/api`;

  constructor(customBaseUrl?: string) {
    if (customBaseUrl) {
      this.baseUrl = customBaseUrl;
    }
  }

  /**
   * Obtiene el valor de una cookie por su nombre.
   * Útil para recuperar el csrftoken de Django.
   */
  private getCookie(name: string): string | null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  private getHeaders(contentType?: string): HeadersInit {
    const headers: any = {
      'Content-Type': contentType || 'application/json',
      'ngrok-skip-browser-warning': '69420',
    };
    if (contentType === 'multipart/form-data') {
      delete headers['Content-Type'];
    }
    // Incluir el token CSRF para Django
    const csrfToken = this.getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    // Soporte para token Bearer si existe en localStorage
    const token = localStorage.getItem('uapa_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}${response.statusText ? `: ${response.statusText}` : ''}`;
      let errorData: any = {};
      
      try {
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = text.length < 100 ? text : errorMessage;
          }
        }
      } catch (e) {
        // Fallback silencioso
      }
      
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  protected async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include', // Permite envío/recepción de cookies HttpOnly (Session)
    });
    return this.handleResponse<T>(response);
  }

  protected async getText(endpoint: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.text();
  }

  protected async post<T>(endpoint: string, body: any): Promise<T> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(isFormData ? 'multipart/form-data' : undefined),
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  protected async patch<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  protected async put<T>(endpoint: string, body: any): Promise<T> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(isFormData ? 'multipart/form-data' : undefined),
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }

  protected async del<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return this.handleResponse<T>(response);
  }
}
