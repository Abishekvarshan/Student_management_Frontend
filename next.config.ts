import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },

  /**
   * Proxy API requests through Next.js to avoid browser CORS issues.
   * Frontend should call `/api/...` (same-origin) and Next will forward to the backend.
   */
  async rewrites() {
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
    return [
      // Backend student routes are not under `/api` in your Spring Boot setup
      {
        source: "/api/student/:path*",
        destination: `${backendBaseUrl}/student/:path*`,
      },
      // Backend admin routes are not under `/api` in your Spring Boot setup
      {
        source: "/api/admin/:path*",
        destination: `${backendBaseUrl}/admin/:path*`,
      },
      // Generic API proxy to backend `/api/*`
      // IMPORTANT: keep this AFTER more specific `/api/student/*` and `/api/admin/*` rules.
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
