
"use client";

import { useEffect, useState } from "react";
import type { LeagueCode } from "@/lib/teamLogos";
import { getLmpPitcherPhotos } from "@/lib/lmpPitcherPhotos";

type Pitcher = {
  id: number;
  name: string;
  imageUrl?: string;
};

type GamePitcherProps = {
  pitcher?: Pitcher;
  league: LeagueCode;
  label?: string;
};

export default function GamePitcher({
  pitcher,
  league,
  label = "P. PROBABLE",
}: GamePitcherProps) {
  const [photoAttempt, setPhotoAttempt] = useState(0);

  // Si cambia el pitcher, permitir cargar la foto del nuevo jugador.
  useEffect(() => {
    setPhotoAttempt(0);
  }, [pitcher?.id, pitcher?.imageUrl, league]);

  // La LMP puede publicar el mugshot real en su scoreboard. Si esa
  // imagen falla o el feed no la trae, se prueba el retrato oficial
  // MiLB del MISMO playerId; nunca se reemplaza por un escudo de equipo.
  const mlbPhoto = pitcher?.id
    ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${pitcher.id}/headshot/67/current`
    : null;
  const milbPhoto = pitcher?.id
    ? `https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_80/v1/people/${pitcher.id}/headshot/milb/current`
    : null;
  const candidates = pitcher
    ? league === "LMP"
      ? getLmpPitcherPhotos(pitcher.id, pitcher.imageUrl)
      : league === "MLB"
        ? [mlbPhoto]
        : league === "LMB"
          ? [milbPhoto]
          : []
    : [];
  const photos = [...new Set(candidates.filter((url): url is string => Boolean(url)))];
  const photoUrl = photos[photoAttempt] ?? null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        marginTop: "16px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          color: "var(--muted)",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>

      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`Foto de ${pitcher?.name}`}
          width={48}
          height={48}
          onError={() => setPhotoAttempt((attempt) => attempt + 1)}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            objectFit: "cover",
            background: "var(--panel2)",
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px dashed var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}

      <span
        style={{
          color: pitcher
            ? "var(--text)"
            : "var(--muted)",
          fontSize: "12px",
          fontWeight: pitcher ? 700 : 500,
          lineHeight: 1.35,
          maxWidth: "160px",
        }}
      >
        {pitcher?.name ?? "Por confirmar"}
      </span>
    </div>
  );
}
