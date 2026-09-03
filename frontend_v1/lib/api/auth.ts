import { apiClient } from '@/lib/api/client';

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
  shopStatus: string;
  subscriptionStatus: string;
}

/**
 * Login an owner and store JWT in localStorage.
 */
export async function loginOwner(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (typeof window !== 'undefined' && response?.token) {
    localStorage.setItem('authToken', response.token);
  }
  return response;
}
