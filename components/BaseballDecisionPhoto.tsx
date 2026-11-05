"use client";

import { useEffect, useState } from "react";
import { getLmpPitcherPhotos } from "@/lib/lmpPitcherPhotos";

// En LMP usamos las MISMAS fotos que ABRIÓ; nunca el mugshot genérico
// que en algunos jugadores devuelve el escudo del equipo.
export default function BaseballDecisionPhoto({
  playerId,
  league,
  imageUrl,
}: {
  playerId?: number;
  league: "MLB" | "LMB" | "LMP" | "CARIBE";
  imageUrl?: string;
}) {
  const [photoAttempt, setPhotoAttempt] = useState(0);

  useEffect(() => {
    setPhotoAttempt(0);
  }, [playerId, league, imageUrl]);

  if (!playerId || !Number.isSafeInteger(playerId) || playerId <= 0) {
    return null;
  }

  const photos =
    league === "LMP"
      ? getLmpPitcherPhotos(playerId, imageUrl)
      : league === "LMB"
        ? [`https://img.mlbstatic.com/mlb-photos/image/upload/w_70,g_auto,c_fill/v1/people/${playerId}/headshot/milb/current`]
        : league === "MLB" || league === "CARIBE"
          ? [`https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${playerId}/headshot/67/current`]
          : [];

  const photo = photos[photoAttempt];
  if (!photo) return null;

  return (
    <img
      src={photo}
      alt=""
      aria-hidden="true"
      className="baseballExtrasDecisionPortrait"
      width={34}
      height={34}
      loading="lazy"
      onError={() => setPhotoAttempt((current) => current + 1)}
    />
  );
}
