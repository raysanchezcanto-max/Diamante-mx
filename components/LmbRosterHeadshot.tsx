"use client";

import { useEffect, useState } from "react";

export default function LmbRosterHeadshot({
  playerId,
  name,
}: {
  playerId: number;
  name: string;
}) {
  // Mismo formato de retrato usado por la ficha oficial de jugador en LMB:
  // https://lmb.com.mx/jugador/{playerId} -> /headshot/milb/current.
  // Mantener el retrato MLB previo como respaldo antes de utilizar iniciales.
  const photoSources = [
    `https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_180/v1/people/${playerId}/headshot/milb/current`,
    `https://img.mlbstatic.com/mlb-photos/image/upload/w_112,q_auto:best/v1/people/${playerId}/headshot/67/current`,
  ];
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [playerId]);

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className="clubRosterAvatar">
      {sourceIndex < photoSources.length ? (
        <img
          key={playerId + "-" + sourceIndex}
          src={photoSources[sourceIndex]}
          alt={"Retrato de " + name}
          width={46}
          height={46}
          loading="lazy"
          onError={() => setSourceIndex(index => Math.min(index + 1, photoSources.length))}
        />
      ) : (
        <span className="clubRosterAvatarFallback" aria-label={"Sin fotografía disponible de " + name}>
          {initials}
        </span>
      )}
    </span>
  );
}
