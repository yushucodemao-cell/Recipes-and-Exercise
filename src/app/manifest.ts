import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "好吃好练",
    short_name: "好吃好练",
    description: "室友食谱规划 & 健康记录",
    start_url: `${basePath || "/"}`,
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#f97316",
    orientation: "portrait",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
