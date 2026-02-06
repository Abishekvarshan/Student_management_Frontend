"use client";

import { api } from "./http";
import type { LoginRequest, LoginResponse, RegisterRequest } from "./types";
import { setToken, setUser } from "./storage";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>(`/api/auth/login`, payload);
  const data = res.data;

  // Persist auth
  setToken(data.token);
  setUser({ userId: data.userId, username: data.username, email: data.email, role: data.role });

  return data;
}

export async function register(payload: RegisterRequest): Promise<void> {
  await api.post(`/api/auth/register`, payload);
}
