// How the browser reaches the API:
//
//  PROXY (default for production builds): the app forwards /api/v1/* to your API itself, so the browser only ever talks to the
//  site it loaded. The sign-in cookie is then first-party and works on every browser, including iPhones, which block the
//  cross-site cookies a separate API address would need. Triggered by API_ORIGIN, or automatically from an absolute
//  NEXT_PUBLIC_API_URL in a production build.
//
//  DIRECT: set API_MODE=direct and the browser calls NEXT_PUBLIC_API_URL itself. Only do this when the app and API share one
//  parent domain (app.example.com + api.example.com), and during local development (which is always direct).
const originOf = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
};

const direct = process.env.API_MODE === "direct";
const explicit = process.env.API_ORIGIN?.trim().replace(/\/+$/, "");
const publicUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const isProductionBuild = process.env.NODE_ENV === "production";

const apiOrigin = direct ? undefined : explicit || (isProductionBuild && publicUrl ? originOf(publicUrl) : undefined);

if (isProductionBuild && !apiOrigin && !publicUrl) {
  console.warn("[loop] Neither API_ORIGIN nor NEXT_PUBLIC_API_URL is set, so the built app will try to call localhost.");
} else if (apiOrigin) {
  console.log(`[loop] API calls go through this app to ${apiOrigin} (set API_MODE=direct to call it from the browser instead).`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: apiOrigin ? { NEXT_PUBLIC_API_URL: "/api/v1" } : {},
  async rewrites() {
    return apiOrigin ? [{ source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` }] : [];
  },
};

export default nextConfig;
