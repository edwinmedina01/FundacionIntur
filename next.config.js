/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true, // 👈 Desactiva ESLint en el build de Vercel
    },
  };
  
  module.exports = nextConfig;
  