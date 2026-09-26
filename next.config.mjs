/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // static export for GitHub Pages; NEXT_PUBLIC_BASE_PATH=/cutanea when building for the project page
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
