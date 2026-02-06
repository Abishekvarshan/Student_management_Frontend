"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../auth/api";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await login({ email: email.trim(), password });
      setAuth({
        token: data.token,
        user: { userId: data.userId, username: data.username, email: data.email, role: data.role },
      });
      router.replace("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="text-slate-500 text-sm">Use your account to access the system.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
