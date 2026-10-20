import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Images uploaded through the admin live in the Supabase media bucket.
    remotePatterns: [new URL("https://geajhjiceaocsljqffkh.supabase.co/storage/v1/object/public/axon-arbor-media/**")],
  },
  // Keep links to the old Odoo site (axonarbor.in) working.
  async redirects() {
    return [
      { source: "/our-programs", destination: "/programmes", permanent: true },
      { source: "/the-hospitality-vertical", destination: "/hospitality", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contactus", destination: "/contact", permanent: true },
      { source: "/web/login", destination: "/sign-in", permanent: false },
    ];
  },
};

export default nextConfig;
