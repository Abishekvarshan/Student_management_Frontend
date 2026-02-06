"use client";

import axios from "axios";
import { getToken } from "./storage";

// NOTE: Use same-origin baseURL. Next.js `rewrites()` proxies `/api/*` to the backend,
// which avoids browser CORS issues.
export const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use((config) => {
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
