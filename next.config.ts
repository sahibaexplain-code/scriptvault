import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its font metric files from disk, so it must not be bundled.
  serverExternalPackages: ["pdfkit"],
  // Ship the embedded PDF fonts with the download function on Vercel.
  outputFileTracingIncludes: {
    "/api/download/[scriptId]": ["./assets/fonts/**/*"],
  },
  poweredByHeader: false,
  agentRules: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
