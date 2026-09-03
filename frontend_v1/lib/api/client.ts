const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Retrieve JWT from localStorage if present
  const authHeader: HeadersInit = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      authHeader["Authorization"] = `Bearer ${token}`;
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeader,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return {} as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
