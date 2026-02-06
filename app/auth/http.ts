"use client";

import axios from "axios";
import { getToken } from "./storage";

// NOTE: Use same-origin baseURL. Next.js `rewrites()` proxies `/api/*` to the backend,
// which avoids browser CORS issues.
export const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use((config) => {
  // Never attach Bearer token to auth endpoints.
  // This prevents backend JWT filters from rejecting login/register calls
  // when the browser has a stale/invalid token in localStorage.
  const url = config.url ?? "";
  if (url.startsWith("/api/auth/")) {
    if (config.headers && "Authorization" in config.headers) {
      // @ts-expect-error - axios headers type can be complex
      delete config.headers.Authorization;
    }
    return config;
  }

  const stored = getToken();
  if (stored) {
    // Some backends return tokens with the `Bearer ` prefix already.
    // Normalize to avoid sending `Bearer Bearer <token>` which results in 401/403.
    const token = stored.startsWith("Bearer ") ? stored.slice("Bearer ".length) : stored;
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
