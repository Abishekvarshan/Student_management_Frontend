"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "./types";
import { clearAuth, getToken, getUser, setToken, setUser } from "./storage";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  /**
   * True once we've attempted to load auth state from storage on the client.
   * This prevents protected pages from firing API requests before the token is available.
   */
  isInitialized: boolean;
  setAuth: (next: { token: string; user: AuthUser }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from storage on first client render
    setTokenState(getToken());
    setUserState(getUser());
    setIsInitialized(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      token,
      user,
      isAuthenticated: Boolean(token),
      isInitialized,
      setAuth: (next) => {
        setToken(next.token);
        setUser(next.user);
        setTokenState(next.token);
        setUserState(next.user);
        setIsInitialized(true);
      },
      logout: () => {
        clearAuth();
        setTokenState(null);
        setUserState(null);
        setIsInitialized(true);
      },
    };
  }, [token, user, isInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
