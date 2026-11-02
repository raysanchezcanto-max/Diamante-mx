import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Diamante MX",
    short_name: "Diamante MX",
    description:
      "Béisbol en vivo: marcadores, resultados, posiciones y estadísticas de MLB, LMB y LMP.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07110d",
    theme_color: "#07110d",
    lang: "es-MX",
    categories: ["sports", "news"],
    icons: [
      {
        src: "/diamante-mx-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/diamante-mx-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/diamante-mx-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
