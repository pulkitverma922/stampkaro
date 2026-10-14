import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StampKaro",
    short_name: "StampKaro",
    description: "Har visit pe stamp, har stamp pe reward.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#ff7a00",
    orientation: "portrait-primary",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
