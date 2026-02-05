"use client";

import './globals.css';
import Sidebar from './sidebar/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="ml-0 w-full px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
