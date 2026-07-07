/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is only needed for the Docker image (server.js). For a
  // normal Node host (Render/Railway) `next start` must be used, which does not
  // work with standalone — so we opt in only when NEXT_OUTPUT_STANDALONE=1
  // (set in the frontend Dockerfile).
  output: process.env.NEXT_OUTPUT_STANDALONE === "1" ? "standalone" : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" }
        ]
      }
    ];
  }
};
export default nextConfig;
