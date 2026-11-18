const apiOrigin = process.env.API_ORIGIN?.replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When the API lives on a different site, browsers drop its session cookie. Set API_ORIGIN and
  // NEXT_PUBLIC_API_URL=/api/v1 to send API calls through this app instead, so the cookie belongs to this site.
  async rewrites() {
    return apiOrigin ? [{ source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` }] : [];
  },
};

export default nextConfig;
