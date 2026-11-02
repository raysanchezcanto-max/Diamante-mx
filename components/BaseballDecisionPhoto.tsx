"use client";

import { useState } from "react";

// Miniaturas de los proveedores de fotos ya utilizados por GamePitcher.
// Si no existe imagen (especialmente jugadores invitados CARIBE),
// desaparece sin dejar iconos rotos ni espacios de marcador de posición.
export default function BaseballDecisionPhoto({
  playerId,
  league,
}: {
  playerId?: number;
  league: "MLB" | "LMB" | "LMP" | "CARIBE";
}) {
  const [failed, setFailed] = useState(false);
  if (!playerId || !Number.isSafeInteger(playerId) || playerId <= 0 || failed) {
    return null;
  }

  const url = league === "LMP"
    ? `https://images.cloudgfx.com/player/mugshot/${playerId}?app=lamp&h=100&w=100`
    : league === "MLB" || league === "CARIBE"
      ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${playerId}/headshot/67/current`
      : null;

  // Aún no está confirmada la fuente de fotos por ID para LMB.
  if (!url) return null;

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      className="baseballExtrasDecisionPortrait"
      width={34}
      height={34}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
