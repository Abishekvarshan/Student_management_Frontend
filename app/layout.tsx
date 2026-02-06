"use client";

import './globals.css';
import Sidebar from './sidebar/Sidebar';
import { AuthProvider } from "./auth/AuthProvider";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AuthProvider>
          {!isAuthPage && <Sidebar />}
          <main className={`${isAuthPage ? "ml-0" : "ml-0 lg:ml-64"} w-full px-4 py-8 sm:px-6 lg:px-8`}>
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
