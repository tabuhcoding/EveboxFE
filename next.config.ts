import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["images.tkbcdn.com", "salt.tkbcdn.com", "res.cloudinary.com", "fastly.picsum.photos"], // Add all external domains here
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // Bỏ canvas để tránh lỗi khi bundle
    }
    return config
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
//   images: {
//     domains: ["images.tkbcdn.com", "salt.tkbcdn.com", "res.cloudinary.com", "fastly.picsum.photos"], // Add all external domains here
//   },
//   output: 'standalone',
// };

// export default nextConfig;