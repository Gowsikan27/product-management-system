export const BASE_URL = "http://localhost:3001/api/v1";

function normalizeApiUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL ?? process.env.REACT_APP_API_URL;

  if (value && value.trim().length > 0) {
    return normalizeApiUrl(value.trim());
  }

  return BASE_URL;
}
