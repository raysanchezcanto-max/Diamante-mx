#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { getMlbClubVerifiedVideos } = require("../lib/mlbClubVideos.ts");
const { MLB_MEXICO_VERIFIED_CONNECTIONS } = require("../lib/mlbMexicoVerifiedConnections.ts");
const page = fs.readFileSync(path.join(__dirname, "../app/equipos/mlb/[id]/page.tsx"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "../app/globals.css"), "utf8");
const mexicoCards = fs.readFileSync(path.join(__dirname, "../components/MlbMexicanConnections.tsx"), "utf8");
const videoList = getMlbClubVerifiedVideos(144);
let count = 0;
function check(yes, message) { assert.ok(yes, message); count++; }

for (const [view, marker] of [
  ["resumen", "clubContentGrid"], ["estadisticas", "ClubStatisticsProfile"],
  ["plantilla", "clubRosterGrid"], ["movimientos", "clubMovementsTimeline"],
  ["grandes-ligas", "MlbMexicanConnections"], ["historia", "MlbClubEditorialHistory"],
]) {
  check(page.includes(`view === "${view}"`) && page.includes(marker), `${view}: datos y estructura`);
}
check(page.indexOf("news?.items.length ? <article") < page.indexOf("editorial ? <article"),
  "Resumen prioriza noticia actual y conserva archivo histórico como alternativa");
check(page.includes("secondaryNews.map") && page.includes("clubVideoGrid"),
  "Resumen muestra varias noticias y una selección audiovisual");
check(page.includes("news?.items.length ?") && page.includes("Los videos oficiales") === false,
  "sin cartela vacía de videos cuando hay piezas verificadas");
check(videoList.length >= 3, "Atlanta tiene por lo menos tres videos individuales verificables");
for (const video of videoList) {
  check(/^https:\/\/www\.mlb\.com\//.test(video.url) && video.title && video.date && video.duration,
    "video con fuente oficial, título, fecha y duración: " + video.title);
}
check(MLB_MEXICO_VERIFIED_CONNECTIONS.filter(row => row.mlbClubId === 144).length >= 9,
  "Atlanta: al menos nueve conexiones de clubes mexicanos documentadas");
check(MLB_MEXICO_VERIFIED_CONNECTIONS.some(row => row.connection.league === "LMP" && row.mlbClubId === 144),
  "conexiones de Atlanta incluyen LMP");
check(MLB_MEXICO_VERIFIED_CONNECTIONS.some(row => row.connection.direction === "mlb-to-mexico" && row.mlbClubId === 144),
  "conexiones incluyen exjugadores de Atlanta que jugaron en México");
check(mexicoCards.includes("Visitar perfil de {person.mexicanClub}") &&
  !mexicoCards.includes("Ver trayectoria en {person.mexicanClub}"),
  "enlace al club mexicano no promete una ficha individual recíproca aún no incorporada");
check(css.includes(".clubVideoCard") && css.includes(".clubMovementsContent--mlb .clubMovementsTimeline"),
  "videos y movimientos cuentan con estilos responsivos");

process.stdout.write("Auditoría de estructura Atlanta: " + count + " verificaciones OK.\n");
