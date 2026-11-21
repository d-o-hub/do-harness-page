import type { NextConfig } from "next";

/* Output mode is chosen at build time:
   - default      -> "standalone" (self-contained server for the platform deploy)
   - PAGES_EXPORT=1 -> "export"  (static bundle for GitHub Pages, gh-pages branch)
   The Pages target serves the site from a repository subpath, so export mode
   also pins basePath to the repo name and drops server-only config: custom
   headers are not possible on GitHub Pages, and output:"export" rejects them. */
const pagesExport = process.env.PAGES_EXPORT === "1";
const pagesBasePath = "/do-harness-page";

const nextConfig: NextConfig = pagesExport
  ? {
      output: "export",
      basePath: pagesBasePath,
      /* Assets are served from a "c" subfolder (scripts/deploy-gh-pages.sh
         mirrors _next there): the CDN holds stale 404 entries for the
         default /_next/ asset URLs, so the export must not reference them. */
      assetPrefix: `${pagesBasePath}/c`,
      images: { unoptimized: true },
      reactStrictMode: false,
    }
  : {
      output: "standalone",
      reactStrictMode: false,
      async headers() {
        return [
          {
            source: "/:path*",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              { key: "X-Frame-Options", value: "SAMEORIGIN" },
            ],
          },
        ];
      },
    };

export default nextConfig;
