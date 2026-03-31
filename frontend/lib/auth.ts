export const TOKEN_KEY = "spms_access_token";

type JwtPayload = {
  exp?: number;
};

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return Boolean(getToken()) && !isTokenExpired();
}

export function getTokenExpiry(): number | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(parts[1])) as JwtPayload;
    if (!payload.exp) {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export function isTokenExpired(): boolean {
  const expiry = getTokenExpiry();
  if (!expiry) {
    return false;
  }

  return Date.now() >= expiry;
}
