import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Make sure the Hebrew font used by the opengraph-image routes is traced into
  // their serverless bundles (it's read from disk at request time).
  outputFileTracingIncludes: {
    "/[lang]/**": ["./lib/Heebo.ttf"],
  },
};

export default nextConfig;
