"use client";

import { useState } from "react";
import type { Game, Standing } from "@/lib/mlb";
import {
  getTeamLogo,
  getTeamDisplayName,
  type LeagueCode,
} from "@/lib/teamLogos";

// Catálogo de respaldo para cuando las posiciones no estén disponibles.
// Si la liga devuelve su tabla, usamos esos equipos y sus datos reales.
const FALLBACK_TEAMS: Record<LeagueCode, Array<{ id: number; name: string }>> = {
  MLB: [
    {id:109,name:"Arizona Diamondbacks"},{id:144,name:"Atlanta Braves"},
    {id:110,name:"Baltimore Orioles"},{id:111,name:"Boston Red Sox"},
    {id:112,name:"Chicago Cubs"},{id:145,name:"Chicago White Sox"},
    {id:113,name:"Cincinnati Reds"},{id:114,name:"Cleveland Guardians"},
    {id:115,name:"Colorado Rockies"},{id:116,name:"Detroit Tigers"},
    {id:117,name:"Houston Astros"},{id:118,name:"Kansas City Royals"},
    {id:108,name:"Los Angeles Angels"},{id:119,name:"Los Angeles Dodgers"},
    {id:146,name:"Miami Marlins"},{id:158,name:"Milwaukee Brewers"},
    {id:142,name:"Minnesota Twins"},{id:121,name:"New York Mets"},
    {id:147,name:"New York Yankees"},{id:133,name:"Athletics"},
    {id:143,name:"Philadelphia Phillies"},{id:134,name:"Pittsburgh Pirates"},
    {id:135,name:"San Diego Padres"},{id:137,name:"San Francisco Giants"},
    {id:136,name:"Seattle Mariners"},{id:138,name:"St. Louis Cardinals"},
    {id:139,name:"Tampa Bay Rays"},{id:140,name:"Texas Rangers"},
    {id:141,name:"Toronto Blue Jays"},{id:120,name:"Washington Nationals"},
  ],
  LMB: [
    "Acereros del Norte","Algodoneros Union Laguna",
    "Bravos de León","Caliente de Durango","Charros de Jalisco",
    "Conspiradores de Querétaro","Diablos Rojos del México",
    "Dorados de Chihuahua","El Águila de Veracruz","Guerreros de Oaxaca",
    "Leones de Yucatán","Olmecas de Tabasco","Pericos de Puebla",
    "Piratas de Campeche","Rieleros de Aguascalientes",
    "Saraperos de Saltillo","Sultanes de Monterrey","Tecos de los Dos Laredos",
    "Tigres de Quintana Roo","Toros de Tijuana",
  ].map(name=>({id:0,name})),
  LMP: [
    "Algodoneros de Guasave","Águilas de Mexicali",
    "Cañeros de Los Mochis","Charros de Jalisco","Jaguares de Nayarit",
    "Mayos de Navojoa","Naranjeros de Hermosillo",
    "Tomateros de Culiacán","Venados de Mazatlán","Yaquis de Obregón",
  ].map(name=>({id:0,name})),
};

// Insignias de gorra transparentes para la franja, sin sustituir el logo
// completo de cada club en partidos, tablas ni fichas.
function getStripLogo(league: LeagueCode, teamId: number, teamName: string): string | null {
  if (league === "LMB") {
    const normalized = teamName.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (normalized.includes("leones de yucatan") || normalized === "leones") {
      return "/logos/lmb/nav/leones-cap.svg";
    }
    if (normalized.includes("guerreros de oaxaca") || normalized === "guerreros") {
      return "/logos/lmb/nav/guerreros-cap.svg";
    }
  }
  return getTeamLogo(league, teamId, teamName);
}

type Participant = { country: string; flagSrc: string; league: string };
type Team = {
  key: string;
  id: number;
  name: string;
  logo: string | null;
  standing?: Standing;
  region?: string;
};

const clean = (name: string) => name.normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();

function listTeams(
  league: LeagueCode | "CARIBE",
  standings: Standing[],
  participants: Participant[]
): Team[] {
  if (league === "CARIBE") {
    return participants.map((p, i) => ({
      key: `caribe-${i}`, id: 0, name: p.country,
      logo: p.flagSrc, region: p.league,
    }));
  }

  const source = standings.length
    ? standings.map(s=>({ id:s.teamId, name:s.team, standing:s }))
    : FALLBACK_TEAMS[league].map(t=>({ ...t, standing: undefined }));
  const seen = new Set<string>();
  return source.flatMap(t=>{
    const display = getTeamDisplayName(league,t.name);
    const key = t.id ? String(t.id) : clean(display);
    if(seen.has(key)) return [];
    seen.add(key);
    return [{
      key,id:t.id,name:display,
      logo:getStripLogo(league,t.id,t.name),
      standing:t.standing,
      region:t.standing?.division,
    }];
  });
}

export default function TeamLogoStrip({
  league, standings = [], games = [], nextGames = [], participants = [],
}: {
  league: LeagueCode | "CARIBE";
  standings?: Standing[];
  games?: Game[];
  nextGames?: Game[];
  participants?: Participant[];
}) {
  const [selected,setSelected] = useState<string | null>(null);
  const teams = listTeams(league,standings,participants);
  const club = teams.find(t=>t.key===selected);
  const upcoming = club && league !== "CARIBE" ? [...games,...nextGames]
    .filter(g=>g.status==="Preview" && (g.awayId===club.id || g.homeId===club.id ||
      (!club.id && [g.away,g.home].some(name=>clean(getTeamDisplayName(league,name))===clean(club.name)))))
    .filter(g=>Number.isFinite(Date.parse(g.startTime)) && Date.parse(g.startTime)>Date.now())
    .sort((a,b)=>Date.parse(a.startTime)-Date.parse(b.startTime))[0] : undefined;
  const opponent = upcoming && club && league !== "CARIBE"
    ? getTeamDisplayName(league,upcoming.awayId===club.id ||
      (!club.id && clean(getTeamDisplayName(league,upcoming.away))===clean(club.name))
        ? upcoming.home : upcoming.away)
    : undefined;

  return (
    <div className={`teamExplorer teamExplorer--${league.toLowerCase()}`}>
      <div className="teamLogoRail" aria-label={league==="CARIBE"?"Participantes del Caribe":`Equipos de ${league}`}>
        <div className="teamLogoTrack">
          {teams.map(team=>{
            const normalizedName = clean(team.name);
            const isAlgodonerosLmb = league === "LMB" &&
              (normalizedName.includes("algodoneros") && normalizedName.includes("laguna"));
            const content = team.logo ? (
              <img src={team.logo} alt="" width={38} height={38} loading="lazy" />
            ) : (
              <span className="teamLogoInitials">{team.name.slice(0,2)}</span>
            );
            return isAlgodonerosLmb ? (
              <a
                href="/equipos/lmb/algodoneros"
                target="_blank"
                rel="noopener noreferrer"
                className={"teamLogoChoice" + (selected===team.key?" is-selected":"")}
                aria-label={"Abrir perfil completo de " + team.name + " en otra pestaña"}
                title={team.name + " · Abrir ficha completa"}
                key={team.key}
                onClick={()=>setSelected(s=>s===team.key?null:team.key)}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                className={"teamLogoChoice" + (selected===team.key?" is-selected":"")}
                aria-label={"Ver datos de " + team.name}
                aria-pressed={selected===team.key}
                title={team.name}
                key={team.key}
                onClick={()=>setSelected(s=>s===team.key?null:team.key)}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
      {club && (
        <section className="teamQuickCard" aria-label={`Datos de ${club.name}`}>
          <div className="teamQuickIdentity">
            {club.logo && <img src={club.logo} alt="" width={50} height={50} />}
            <div>
              <span className="eyebrow">{league==="CARIBE"?"PARTICIPANTE":"FICHA DE EQUIPO"}</span>
              <h3>{club.name}</h3>
              <small>{club.region || league}</small>
            </div>
          </div>
          <div className="teamQuickStats">
            {club.standing ? (
              <>
                <span><strong>{club.standing.wins}</strong><small>GANADOS</small></span>
                <span><strong>{club.standing.losses}</strong><small>PERDIDOS</small></span>
                <span><strong>{club.standing.pct}</strong><small>PCT</small></span>
              </>
            ) : (
              <p>{league==="CARIBE"
                ?"El club representante se confirmará cuando se anuncie oficialmente."
                :"Estadísticas del equipo por confirmar."}</p>
            )}
          </div>
          <div className="teamQuickActions">
            {league === "LMB" && clean(club.name).includes("algodoneros") &&
              clean(club.name).includes("laguna") && (
              <a href="/equipos/lmb/algodoneros" target="_blank" rel="noopener noreferrer">
                Ver perfil completo ↗
              </a>
            )}
            {opponent && upcoming ? (
              <span className="teamQuickFixture">
                Próximo vs. {opponent} · {new Intl.DateTimeFormat("es-MX",{
                  day:"numeric",month:"short",timeZone:"America/Mexico_City",
                }).format(new Date(upcoming.startTime))}
              </span>
            ) : league!=="CARIBE" ? (
              <span className="teamQuickFixture">Próximo encuentro por confirmar</span>
            ) : null}
            {league!=="CARIBE" && club.standing && (
              <a href="#posiciones">Ver posiciones</a>
            )}
            <button type="button" onClick={()=>setSelected(null)} aria-label="Cerrar ficha">
              Cerrar ×
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
