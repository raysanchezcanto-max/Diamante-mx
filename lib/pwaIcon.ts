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
      createElement(
        "div",
        {
          style: {
            display: "flex",
            color: "#d7ff4f",
            fontSize: size * 0.52,
            lineHeight: 1,
            marginTop: size * -0.015,
          },
        },
        "◆"
      ),
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
