import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable Cache Components (Next.js 16+)
   * This enables the `use cache` directive for caching components and functions
   * @see https://nextjs.org/docs/app/api-reference/directives/use-cache
   */
  cacheComponents: true,
};

export default nextConfig;
