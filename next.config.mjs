const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : "placeholder.supabase.co";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"], remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] },
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
  async redirects() {
    return [{ source: "/product/:slug", destination: "/products/:slug", permanent: true }];
  },
};
export default nextConfig;
