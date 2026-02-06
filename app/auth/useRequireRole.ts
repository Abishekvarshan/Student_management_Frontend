"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "./types";
import { useAuth } from "./AuthProvider";

/**
 * Redirects to /dashboard when user is authenticated but doesn't have the required role.
 * Combines nicely with `useRequireAuth()`.
 */
export function useRequireRole(allowedRoles: UserRole[]) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) return; // useRequireAuth() handles redirect to /login

    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) {
      router.replace("/dashboard");
    }
  }, [allowedRoles, isAuthenticated, isInitialized, router, user?.role]);
}
