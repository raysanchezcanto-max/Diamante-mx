#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { getMlbClubVerifiedVideos } = require("../lib/mlbClubVideos.ts");
const { mlbEditorialHistory } = require("../lib/mlbHistoryEditorial.ts");
const { MLB_MEXICO_VERIFIED_CONNECTIONS } = require("../lib/mlbMexicoVerifiedConnections.ts");
const { LMB_CLUB_DIRECTORY } = require("../lib/lmbClubs.ts");
const { LMP_CLUB_DIRECTORY } = require("../lib/lmpClubDirectory.ts");
const page = fs.readFileSync(path.join(__dirname, "../app/equipos/mlb/[id]/page.tsx"), "utf8");
const historyUI = fs.readFileSync(path.join(__dirname, "../components/MlbClubEditorialHistory.tsx"), "utf8");
let checks = 0;
function check(value, description) { assert.ok(value, description); checks++; }

for (const [view, marker] of [
  ["resumen", "clubContentGrid"], ["estadisticas", "ClubStatisticsProfile"],
  ["plantilla", "clubRosterGrid"], ["movimientos", "clubMovementsTimeline"],
  ["grandes-ligas", "MlbMexicanConnections"], ["historia", "MlbClubEditorialHistory"],
]) check(page.includes(`view === "${view}"`) && page.includes(marker), `Sección ${view} con fuente y estructura compartida`);

const history = mlbEditorialHistory(110);
check(Boolean(history), "Baltimore tiene historia editorial propia");
check(history.debutYear === "1901" && history.intro.includes("1954") &&
  history.pennantClubNames["1944"].includes("Browns"), "franquicia 1901/1954 y banderín 1944 sin confusión de sede");
check(history.worldSeriesTitles === 3 &&
  history.worldSeriesWinningYears.join(",") === "1966,1970,1983", "tres coronas correctas");
check(history.pennants.join(",") === "1944,1966,1969,1970,1971,1979,1983", "siete banderines por franquicia");
check(history.divisionTitles.length === 10 && history.divisionTitles.at(-1) === "2023", "diez títulos divisionales");
check(history.stadiumOpened === "1992" && history.stadiumOpenedNote.includes("6 de abril"), "Camden Yards documentado");
check(history.milestones.length >= 9 && history.legends.length >= 6 && history.immortals.length >= 6,
  "cronología, leyendas y Cooperstown completos");
check(history.immortals.some(legend => legend.name === "Cal Ripken Jr." && legend.year === "2007"),
  "Cal Ripken Jr. 2007 en el Salón de la Fama");
check(history.sources.length >= 6 && history.sources.every(source => source.url.startsWith("https://")),
  "cada bloque histórico cuenta con fuentes oficiales");
check(historyUI.includes("pennantClubName(year)"), "la tarjeta del banderín de 1944 atribuye la sede Browns");

const connections = MLB_MEXICO_VERIFIED_CONNECTIONS.filter(item => item.mlbClubId === 110);
check(connections.length >= 14, "catorce vínculos editoriales documentados");
check(new Set(connections.map(item => item.connection.name)).size >= 10, "al menos diez personas documentadas");
for (const league of ["LMB", "LMP"]) {
  check(connections.some(item => item.connection.league === league && item.group === "debut"),
    `debut posterior desde ${league}`);
  check(connections.some(item => item.connection.league === league && item.group === "toMexico"),
    `jugador de Orioles que después compitió en ${league}`);
}
check(connections.some(item => item.group === "previousExperience" && item.connection.name === "Fernando Valenzuela"),
  "Fernando Valenzuela no se presenta incorrectamente como debutante en Baltimore");
const keys = connections.map(item => `${item.group}:${item.connection.league}:${item.connection.mexicanSlug}:${item.connection.name}`);
check(new Set(keys).size === keys.length, "no hay tarjetas duplicadas para mismo jugador, club, liga y categoría");
for (const { connection } of connections) {
  const directory = connection.league === "LMB" ? LMB_CLUB_DIRECTORY : LMP_CLUB_DIRECTORY;
  check(directory.some(item => item.slug === connection.mexicanSlug), `destino interno válido: ${connection.mexicanClub}`);
  check(connection.source.startsWith("https://") && connection.description.length > 45,
    `fuente segura y descripción sustantiva: ${connection.name}`);
}

const videos = getMlbClubVerifiedVideos(110);
check(videos.length >= 3, "tres videos oficiales individuales, no un enlace genérico");
for (const video of videos) {
  check(video.url.startsWith("https://www.mlb.com/") && video.title && video.date && video.duration,
    `clip con fuente y metadatos: ${video.title}`);
}

process.stdout.write(`Auditoría estructural de Baltimore: ${checks} verificaciones OK.\n`);
