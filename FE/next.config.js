const BE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy /api/* sang BE để trình duyệt chỉ thấy 1 origin duy nhất (domain FE)
  // -> cookie đăng nhập (httpOnly) được lưu trên domain FE, không bị chặn bởi
  // quy tắc cookie cross-site khi FE (Vercel) và BE nằm ở domain khác nhau.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
