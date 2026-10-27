import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Electron 壳加载的是这份服务的地址，不消费构建产物，
  // 所以这里保持默认的服务端输出。
  reactStrictMode: true,
};

export default nextConfig;
