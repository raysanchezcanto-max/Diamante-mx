"use client";

import { useState } from "react";

export default function LeagueTabs() {
  const [league, setLeague] = useState("MLB");
  return (
    <div className="leagueWrap">
      <div className="tabs" role="tablist" aria-label="Ligas">
        {["MLB", "LMB", "LMP"].map((item) => (
          <button
            key={item}
            className={league === item ? "tab active" : "tab"}
            onClick={() => setLeague(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {league !== "MLB" && (
        <div className="comingSoon">
          <strong>{league}</strong> ya está contemplada para la siguiente fase. Primero validaremos la fuente de datos para conectarla de forma estable.
        </div>
      )}
    </div>
  );
}
