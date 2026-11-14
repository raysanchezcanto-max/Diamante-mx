#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MLB_CLUBS, getMlbClub, mlbClubHref, mlbOfficialTeamUrl } =
  require("../lib/mlbClubDirectory.ts");
const read = relativePath => fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");

let checks = 0;
const verify = (condition, label) => { assert.ok(condition, label); checks++; };
verify(MLB_CLUBS.length === 30, "exactamente 30 franquicias MLB");
verify(new Set(MLB_CLUBS.map(club => club.id)).size === 30, "ids unicos");
verify(new Set(MLB_CLUBS.map(club => club.webSlug)).size === 30, "rutas oficiales unicas");
for (const club of MLB_CLUBS) {
  verify(getMlbClub(club.id)?.name === club.name, "catalogo " + club.id);
  verify(mlbClubHref(club.id) === "/equipos/mlb/" + club.id, "ruta " + club.id);
  verify(mlbOfficialTeamUrl(club).startsWith("https://www.mlb.com/"), "origen MLB " + club.id);
}
verify(mlbClubHref(0) === null, "no enlazar equipos desconocidos");
const strip = read("components/TeamLogoStrip.tsx");
verify(strip.includes('league === "MLB"') && strip.includes("mlbClubHref(team.id)"),
  "logos MLB abren perfiles");
verify(strip.includes("lmbClubHref(team.name)") && strip.includes("lmpClubHref(team.name)"),
  "no alterar los enlaces de LMB/LMP");

const page = read("app/equipos/mlb/[id]/page.tsx");
const history = read("components/MlbClubEditorialHistory.tsx");
const tabs = read("components/LmbClubTabs.tsx");
verify(page.includes('import LmbClubTabs'), "mismo componente de pestañas");
verify(page.includes("CLUB_PROFILE_COPY as COPY"), "misma terminologia editorial");
verify(page.includes('className="clubProfile clubProfile--all"'), "contenedor comun");
verify(page.includes('className="clubHero clubDirectoryHero"'), "cabecera comun");
verify(page.includes('className="clubContentGrid"'), "tres columnas en Resumen");
verify(page.includes('className="clubRosterContent"'), "plantilla compartida");
verify(page.includes('className="clubMovementsContent"'), "movimientos compartidos");
verify(page.includes('className="clubBigLeagues clubDirectoryMlb"'), "grandes ligas compartido");
verify(history.includes('className="clubHistory clubDirectoryHistory"'), "historia compartida");
for (const view of ["resumen", "plantilla", "movimientos", "grandes-ligas", "historia"]) {
  verify(page.includes('"' + view + '"') && tabs.includes('id: "' + view + '"'),
    "pestana compartida " + view);
}
for (const component of ["ClubHistoryMetrics", "ClubHistoryStadiumYear"]) {
  verify(history.includes(component), "metrica historica comun " + component);
}
for (const section of ["clubHistorySectionHead", "clubHistoryHall", "clubHistoryOrigins", "clubHistorySources"]) {
  verify(history.includes(section), "bloque de Historia " + section);
}
const { mlbEditorialHistory } = require("../lib/mlbHistoryEditorial.ts");
const raysHistory = mlbEditorialHistory(139);
verify(Boolean(raysHistory), "Rays tienen historia documental propia");
verify(raysHistory.debutYear === "1998", "Rays debutaron en 1998");
verify(raysHistory.stadiumOpened === "1990", "Tropicana Field abrió en 1990");
verify(raysHistory.worldSeriesTitles === 0 && raysHistory.titlesVerifiedThrough === "2026",
  "sin coronas de Serie Mundial hasta 2026");
verify(raysHistory.pennants.join(",") === "2008,2020,2026", "tres banderines de la Americana");
verify(raysHistory.divisionTitles.length === 5, "cinco títulos de división");
verify(raysHistory.milestones.length >= 5, "cronología completa Rays");
verify(raysHistory.legends.length >= 4, "figuras con fuente oficial");
verify(raysHistory.immortals.length === 2 &&
  raysHistory.immortals.every(person => person.url.startsWith("https://baseballhall.org/")),
  "Cooperstown documentado por franquicia");
verify(raysHistory.sources.every(source => source.url.startsWith("https://")),
  "fuentes históricas seguras");
verify(mlbEditorialHistory(158) === null, "sin datos inventados para otras franquicias");
verify(history.includes("mlbEditorialHistory") && history.includes("clubHistoryLegends") &&
  history.includes("clubHistoryHallGrid") && history.includes("clubHistoryChampions"),
  "mismo esquema histórico visual LMB/LMP");

verify(read("lib/mlbClubContent.ts").includes("statsapi.mlb.com/api/v1"),
  "datos MLB desde fuente oficial");
verify(page.includes("getMlbClub(Number(id))"), "validacion de id de franquicia");
process.stdout.write("MLB profile standard regression: " + checks + " checks OK.\n");
