"use client";

import { useState } from "react";

export default function LmbRosterHeadshot({
  playerId,
  name,
}: {
  playerId: number;
  name: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
  const photo = `https://img.mlbstatic.com/mlb-photos/image/upload/w_112,q_auto:best/v1/people/${playerId}/headshot/67/current`;

  return (
    <span className="clubRosterAvatar">
      {failed ? (
        <span className="clubRosterAvatarFallback" aria-label={"Sin fotografía disponible de " + name}>
          {initials}
        </span>
      ) : (
        <img
          src={photo}
          alt={"Retrato de " + name}
          width={46}
          height={46}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
