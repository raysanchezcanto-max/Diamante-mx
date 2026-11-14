"use client";
import { useEffect, useState } from "react";

/** Mismo bloque visual de retratos que LMB/LMP; fuente principal MLB. */
export default function MlbRosterHeadshot({ playerId, name }: { playerId: number; name: string }) {
  const sources = [
    "https://img.mlbstatic.com/mlb-photos/image/upload/w_112,q_auto:best/v1/people/" +
      playerId + "/headshot/67/current",
    "https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_180/v1/people/" +
      playerId + "/headshot/milb/current",
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [playerId]);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(part => part.charAt(0)).join("").toUpperCase();
  return <span className="clubRosterAvatar">
    {index < sources.length
      ? <img key={playerId + "-" + index} src={sources[index]}
          alt={"Retrato de " + name} width={46} height={46} loading="lazy"
          onError={() => setIndex(i => Math.min(i + 1, sources.length))}/>
      : <span className="clubRosterAvatarFallback"
          aria-label={"Sin fotografía disponible de " + name}>{initials}</span>}
  </span>;
}
