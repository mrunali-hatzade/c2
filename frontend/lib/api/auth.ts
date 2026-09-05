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
 * Persist authenticated session in browser localStorage.
 */
export function saveAuthSession(auth: AuthResponse): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', auth.token);
  localStorage.setItem('userRole', auth.role);
  localStorage.setItem('userEmail', auth.email);
  if (auth.fullName) {
    localStorage.setItem('userName', auth.fullName);
  }
}

/**
 * Clear all authentication session keys.
 */
export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('user');
}

/**
 * Retrieve current stored user role (with JWT payload decoding fallback).
 */
export function getStoredRole(): string | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem('userRole');
  if (role) return role;

  // Fallback: extract role directly from JWT payload
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.role) {
          localStorage.setItem('userRole', payload.role);
          return payload.role;
        }
      }
    }
  } catch (e) {
    // Ignore decode error
  }
  return null;
}

/**
 * Check if the stored JWT is expired.
 */
export function isStoredTokenExpired(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return true;
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
}

/**
 * Retrieve current stored JWT token.
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Login user (Admin or Shop Owner) and store session.
 */
export async function loginOwner(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response?.token) {
    saveAuthSession(response);
  }

  return response;
}
