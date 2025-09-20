/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|css|js|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Security headers for all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Add a basic CSP if needed; adjust if you use inline scripts or third-party origins
          // { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https:; object-src 'none';" },
        ],
      },
    ];
  },
};

export default nextConfig;
