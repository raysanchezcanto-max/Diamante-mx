#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const check = (condition, message) => assert.ok(condition, message);
const tabs = read("components/LmbClubTabs.tsx");
const views = ["resumen", "estadisticas", "plantilla", "movimientos", "grandes-ligas", "historia"];
for (const view of views) check(tabs.includes(`id: "${view}"`), `pestaña compartida ${view}`);
check(views.indexOf("estadisticas") === 1, "Estadísticas sigue a Resumen");

const entries = [
  ["MLB", "app/equipos/mlb/[id]/page.tsx"],
  ["LMB", "app/equipos/lmb/[slug]/page.tsx"],
  ["LMB", "app/equipos/lmb/algodoneros/page.tsx"],
  ["LMP", "app/equipos/lmp/[slug]/page.tsx", "components/LmpDirectoryClubProfile.tsx"],
  ["LMP", "app/equipos/lmp/algodoneros/page.tsx"],
];
for (const [league, pagePath, delegatedPath] of entries) {
  const page = read(pagePath);
  const output = page + (delegatedPath ? read(delegatedPath) : "");
  check(page.includes('"estadisticas"'), `${league}: ruta de estadísticas en ${pagePath}`);
  check(output.includes(`ClubStatisticsProfile league="${league}"`),
    `${league}: componente estadístico común en ${pagePath}`);
  check(page.includes("getClubSeasonStandings"), `${league}: tabla de la misma temporada`);
  check(page.includes("getLatestClubSeasonStatistics"), `${league}: cifras desde fuente oficial`);
}

const stats = read("lib/clubStatistics.ts");
for (const guard of [
  "teamId: String(teamId)", "row.team?.id === teamId", "group=hitting", "group=pitching",
  "league === \"LMP\"", "getClubSeasonStandings", "entry.divisionRank", "entry.leagueRank",
]) check(stats.includes(guard), `estadísticas: ${guard}`);
const view = read("components/ClubStatisticsProfile.tsx");
const leaders = read("components/ClubStatisticsLeaders.tsx");
for (const label of [
  "POSICIÓN EN", "JUEGOS GANADOS / PERDIDOS", "PORCENTAJE DE VICTORIAS",
  "Bateo colectivo", "Pitcheo colectivo", "Rendimiento de temporada regular",
  "Ver tabla completa",
]) check(view.includes(label), `sección estadística: ${label}`);
for (const label of ["Bateo", "Pitcheo", "Líderes del equipo", "role=\"tablist\""])
  check(leaders.includes(label), `líderes individuales: ${label}`);

const { clubSeasonLabel } = require("../lib/clubStatistics.ts");
assert.equal(clubSeasonLabel("MLB", 2027), "2027");
assert.equal(clubSeasonLabel("LMB", 2027), "2027");
assert.equal(clubSeasonLabel("LMP", 2026), "2026–27");
assert.equal(clubSeasonLabel("LMP", 2027), "2027–28");

const coverage = read("scripts/club-profile-coverage-audit.cjs");
check(coverage.includes("360 vistas"), "auditoría cubre 60 equipos por seis vistas");
const contract = read("CLUB_PROFILE_STANDARD.md");
check(contract.includes("Estadísticas"), "estándar maestro incluye Estadísticas");
console.log("OK pestaña de estadísticas compartida: MLB 30 · LMB 20 · LMP 10; temporadas automáticas y fuentes separadas.");
