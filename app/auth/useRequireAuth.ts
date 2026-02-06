"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const PUBLIC_PATHS = new Set<string>(["/login", "/register"]);

export function useRequireAuth() {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (PUBLIC_PATHS.has(pathname)) return;
    // Wait until auth state is loaded from storage before deciding.
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, pathname, router]);
}
