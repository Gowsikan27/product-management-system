import { clearToken, getToken, isTokenExpired } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/env";
import {
  AuthResponse,
  CreateProductPayload,
  LoginPayload,
  ProductListResponse,
  ProductQuery,
  ProductSummary,
  Product,
  RegisterPayload,
  UpdateProductPayload,
  UserProfile,
} from "@/lib/types";

const API_BASE_URL = getApiBaseUrl();
const RETRYABLE_METHODS = new Set(["GET", "HEAD"]);
const MAX_RETRIES = 2;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function resolveErrorMessage(body: unknown, status: number): string {
  if (status === 0) {
    return "Cannot connect to API server. Please check backend status and try again.";
  }

  if (process.env.NODE_ENV === "production" && status >= 500) {
    return "Something went wrong. Please try again.";
  }

  if (!body || typeof body !== "object") {
    return "Request failed";
  }

  const message = (body as { message?: unknown }).message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    const list = message.filter((item): item is string => typeof item === "string");
    if (list.length > 0) {
      return list.join(". ");
    }
  }

  return "Request failed";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (isTokenExpired()) {
    clearToken();
    throw new ApiError("Your session expired. Please sign in again.", 401);
  }

  const token = getToken();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = (init.method ?? "GET").toUpperCase();
  const maxRetries = RETRYABLE_METHODS.has(method) ? MAX_RETRIES : 0;

  let response: Response | null = null;
  let networkError = false;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
      });
      networkError = false;

      if (response.status >= 500 && attempt < maxRetries) {
        await delay(300 * (attempt + 1));
        continue;
      }

      break;
    } catch {
      networkError = true;

      if (attempt >= maxRetries) {
        break;
      }

      await delay(300 * (attempt + 1));
    }
  }

  if (!response) {
    if (networkError) {
      throw new ApiError(
        "Cannot connect to API server. Please ensure backend is running on http://localhost:3001.",
        0,
      );
    }

    throw new ApiError("Request failed", 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = resolveErrorMessage(body, response.status);

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function login(payload: LoginPayload) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request<UserProfile>("/users/me");
}

function createProductQueryParams(query: ProductQuery = {}) {
  const params = new URLSearchParams();

  if (query.page) {
    params.set("page", String(query.page));
  }

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder) {
    params.set("sortOrder", query.sortOrder);
  }

  if (typeof query.minPrice === "number") {
    params.set("minPrice", String(query.minPrice));
  }

  if (typeof query.maxPrice === "number") {
    params.set("maxPrice", String(query.maxPrice));
  }

  const value = params.toString();
  return value ? `?${value}` : "";
}

export function getProducts(query: ProductQuery = {}) {
  return request<ProductListResponse>(`/products${createProductQueryParams(query)}`);
}

export function getProductSummary() {
  return request<ProductSummary>("/products/summary");
}

export function createProduct(payload: CreateProductPayload) {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: string) {
  return request<Product>(`/products/${id}`, {
    method: "DELETE",
  });
}

export function updateProduct(id: string, payload: UpdateProductPayload) {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
