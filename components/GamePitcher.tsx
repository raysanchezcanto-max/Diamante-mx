
"use client";

import { useState } from "react";
import type { LeagueCode } from "@/lib/teamLogos";

type Pitcher = {
  id: number;
  name: string;
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
  const [photoFailed, setPhotoFailed] = useState(false);

  const photoUrl = pitcher
    ? league === "LMP"
      ? `https://images.cloudgfx.com/player/mugshot/${pitcher.id}?app=lamp&h=350&w=250`
      : league === "MLB"
        ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${pitcher.id}/headshot/67/current`
        : null
    : null;

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

      {photoUrl && !photoFailed ? (
        <img
          src={photoUrl}
          alt={`Foto de ${pitcher?.name}`}
          width={48}
          height={48}
          onError={() => setPhotoFailed(true)}
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
            color: "var(--muted)",
            fontSize: "20px",
          }}
        >
          ?
        </div>
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
