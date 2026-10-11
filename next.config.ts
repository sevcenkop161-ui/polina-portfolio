import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статический экспорт: `npm run build` кладёт готовый сайт в папку out/
  output: "export",
  // Оптимизатор картинок Next требует сервер, а у нас чистая статика
  images: { unoptimized: true },
  // не создавать служебный AGENTS.md при next dev
  agentRules: false,
};

export default nextConfig;
