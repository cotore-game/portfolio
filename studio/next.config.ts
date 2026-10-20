import path from "node:path";
import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: {
    root: path.resolve(
      process.cwd(),
      path.basename(process.cwd()) === "studio" ? ".." : ".",
    ),
  },
  serverExternalPackages: [
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/server-util",
  ],
};
export default config;
