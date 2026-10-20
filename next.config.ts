import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  serverExternalPackages: [
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/server-util",
  ],
  basePath: "/portfolio",
  trailingSlash: true,
};

export default nextConfig;
