import { ImageResponse } from "next/og";
import { createElement } from "react";

// Ícono provisional de Diamante MX basado en el rombo y colores
// de su identidad visual. No modifica las tarjetas ni el sitio.
export function createPwaIcon(size: 192 | 512): ImageResponse {
  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#07110d",
          color: "#f5f2e9",
          borderRadius: size * 0.13,
        },
      },
      createElement("div", {
        // Rombo geométrico: no requiere descargar una fuente Unicode.
        style: {
          display: "flex",
          width: size * 0.27,
          height: size * 0.27,
          transform: "rotate(45deg)",
          border: `${Math.max(4, size * 0.025)}px solid #d7ff4f`,
          borderRadius: size * 0.025,
          backgroundColor: "#0d1914",
          marginBottom: size * 0.10,
        },
      }),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: size * 0.089,
            fontWeight: 900,
            letterSpacing: size * 0.003,
            marginTop: size * -0.025,
          },
        },
        "DIAMANTE"
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            color: "#d7ff4f",
            fontSize: size * 0.13,
            fontWeight: 900,
            marginTop: size * 0.006,
          },
        },
        "MX"
      )
    ),
    { width: size, height: size }
  );
}
