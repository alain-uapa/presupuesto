
export class HttpClient {
  // URL base institucional por defecto
  protected baseUrl: string = 'https://abiotic-kenzie-braggadocian.ngrok-free.dev';

  constructor(customBaseUrl?: string) {
    if (customBaseUrl) {
      this.baseUrl = customBaseUrl;
    }
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '69420',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Formatear mensaje base: "Error 401: Unauthorized" o simplemente "Error 401" si no hay texto
      let errorMessage = `Error ${response.status}${response.statusText ? `: ${response.statusText}` : ''}`;
      let errorData: any = {};
      
      try {
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Si no es JSON, usamos el texto plano si existe
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
    });
    return this.handleResponse<T>(response);
  }

  protected async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  protected async patch<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  protected async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}
