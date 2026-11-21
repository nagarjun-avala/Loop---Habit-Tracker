const apiOrigin = process.env.API_ORIGIN?.trim().replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // PROXY MODE: set API_ORIGIN (e.g. https://my-api.example.com) and this app forwards /api/v1/* to the API itself.
  // The browser then only ever talks to this site, so the sign-in cookie is first-party and works even when the two
  // hosts are on different domains. NEXT_PUBLIC_API_URL is set automatically, so API_ORIGIN is the only variable needed.
  // Set it before building: it is baked into the build.
  env: apiOrigin ? { NEXT_PUBLIC_API_URL: "/api/v1" } : {},
  async rewrites() {
    return apiOrigin ? [{ source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` }] : [];
  },
};

export default nextConfig;
