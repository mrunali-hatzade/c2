import { apiClient } from './client';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080';

/** Types aligned with backend ProductRequest DTO */
export interface VariantDto {
  // id is optional for future updates (not needed on creation)
  id?: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface AddonDto {
  id?: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  availability?: boolean;
  variants?: VariantDto[];
  addons?: AddonDto[];
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface ProductAddon {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  availability: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}

/** Fetch all products for the logged‑in owner */
export async function getOwnerProducts(): Promise<Product[]> {
  const response = await apiClient<Product[]>('/api/owner/products', { method: 'GET' });
  return response || [];
}

/** Create a new product for the logged‑in owner */
export async function createOwnerProduct(request: ProductRequest): Promise<Product> {
  const response = await apiClient<Product>('/api/owner/products', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
}

/** Update an existing product for the logged‑in owner */
export async function updateOwnerProduct(id: number, request: ProductRequest): Promise<Product> {
  const response = await apiClient<Product>(`/api/owner/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
}

/** Delete a product by id for the logged‑in owner */
export async function deleteOwnerProduct(id: number): Promise<void> {
  await apiClient<{ message: string }>(`/api/owner/products/${id}`, {
    method: 'DELETE',
  });
}

/** Upload a product image. Uses raw fetch — NOT apiClient — so the browser
 *  auto-generates the multipart boundary. Content-Type must NOT be set manually. */
export interface MediaUploadResponse {
  url: string;
  fileName: string;
  type: string;
}

export async function uploadProductImage(file: File): Promise<MediaUploadResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'products');

  const response = await fetch(`${API_BASE_URL}/api/owner/media/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    // Do NOT set Content-Type — browser must set it with the boundary
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json();
}

/**
 * Normalizes a product image URL from the backend.
 * - If the URL is already absolute (http:// or https://), return it as-is.
 * - If the URL is relative (e.g. /uploads/products/abc.jpg), prepend API_BASE_URL.
 * - Returns empty string for null/undefined.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path – prepend the backend base URL, avoiding double slashes.
  const base = API_BASE_URL.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}
