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
verify(page.includes('className="clubMovementsContent clubMovementsContent--mlb"'),
  "movimientos compartidos, con ajuste visual solo para MLB");
const mexicoConnections = read("components/MlbMexicanConnections.tsx");
verify(page.includes('<MlbMexicanConnections club={club} logo={logo}/>') &&
  mexicoConnections.includes('className="clubBigLeagues clubDirectoryMlb clubDirectoryMlb--franchise"'),
  "Grandes Ligas reutiliza layout para trayectorias mexico-MLB");
verify(history.includes('className="clubHistory clubDirectoryHistory"'), "historia compartida");
for (const view of ["resumen", "estadisticas", "plantilla", "movimientos", "grandes-ligas", "historia"]) {
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
verify(raysHistory.featuredStory.url.startsWith("https://www.mlb.com/rays/news/"),
  "reportaje Rays enlazado a fuente MLB");
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
const brewersHistory = mlbEditorialHistory(158);
verify(Boolean(brewersHistory), "Milwaukee tiene ficha historica propia");
verify(brewersHistory.debutYear === "1969", "franquicia Brewers debuta como Pilots en 1969");
verify(brewersHistory.worldSeriesTitles === 1 &&
  brewersHistory.worldSeriesWinningYears.join(",") === "2026", "Milwaukee campeon MLB 2026");
verify(brewersHistory.pennantLeagues["1982"] === "Liga Americana" &&
  brewersHistory.pennantLeagues["2026"] === "Liga Nacional",
  "banderines de Milwaukee respetan la liga de cada epoca");
verify(brewersHistory.pennantSources["1982"].endsWith("/1982") &&
  brewersHistory.pennantSources["2026"].endsWith("/2026"),
  "cada banderin de Milwaukee lleva a su postemporada correspondiente");
verify(raysHistory.postseasonSource.includes("rays/history/postseason-results"),
  "Rays conservan el enlace a su historial de postemporada");
verify(brewersHistory.divisionTitles.length === 9, "nueve titulos divisionales Milwaukee");
verify(brewersHistory.stadiumOpened === "2001", "estadio Milwaukee abre en 2001");
verify(brewersHistory.milestones.length >= 6 &&
  brewersHistory.legends.length >= 4 && brewersHistory.immortals.length >= 3,
  "cronologia, figuras y Cooperstown de Milwaukee completos");
verify(history.includes("pennantLeague(year)") && history.includes("editorial.worldSeriesTitles > 0"),
  "Historia distingue ligas antiguas y campeonatos de Serie Mundial");
verify(!history.includes("mlb.com/rays/history/postseason-results"),
  "no se muestran fuentes Rays en otras fichas");
verify(page.includes('className="clubFeature"') && page.includes("editorial.featuredStory"),
  "Resumen Rays usa el destacado editorial compartido");
verify(history.includes("mlbEditorialHistory") && history.includes("clubHistoryLegends") &&
  history.includes("clubHistoryHallGrid") && history.includes("clubHistoryChampions"),
  "mismo esquema histórico visual LMB/LMP");

const css = read("app/globals.css");
verify(page.includes('view === "estadisticas" && <ClubStatisticsProfile') &&
  !page.includes('className="clubEditorialSection clubMlbSeasonStats"'),
  "estadisticas MLB tienen pestaña propia y Resumen se centra en noticias");
const statisticsView = read("components/ClubStatisticsProfile.tsx");
for (const panel of ["Bateo colectivo", "Pitcheo colectivo", "Rendimiento de temporada regular",
  "Líderes del equipo", "Tabla general de posiciones"]) {
  verify(statisticsView.includes(panel) || read("components/ClubStatisticsLeaders.tsx").includes(panel),
    "pestana Estadisticas incluye " + panel);
}
verify(page.includes('view === "estadisticas" ? getLatestClubSeasonStatistics("MLB", club.id, mexicoSeasonYear())') &&
  !page.includes('view === "resumen" ? getMlbClubSeasonStats(club)'),
  "las estadisticas se consultan solo en su pestaña independiente");
for (const label of [
  "DEL BÉISBOL MEXICANO AL DIAMANTE INTERNACIONAL",
  "Debutaron en MLB después de su paso por México",
  "Experiencia MLB anterior",
  "Prospectos y contratos de Ligas Menores",
]) verify(label === "DEL BÉISBOL MEXICANO AL DIAMANTE INTERNACIONAL"
  ? read("lib/clubProfileCopy.ts").includes(label) : mexicoConnections.includes(label),
  "Grandes Ligas clasifica trayectorias: " + label);
verify(!mexicoConnections.includes("NÚMEROS DEL EQUIPO") &&
  !mexicoConnections.includes("Pitcheo colectivo") &&
  !mexicoConnections.includes("El equipo frente a sus rivales") &&
  !mexicoConnections.includes("FIGURA HISTÓRICA"),
  "Grandes Ligas no repite estadisticas ni Historia");
const connectionsSource = read("lib/mlbMexicanConnections.ts");
verify(connectionsSource.includes("getLmbToMlbClub") &&
  connectionsSource.includes("LMB_CLUB_DIRECTORY") &&
  connectionsSource.includes("ALGODONEROS_MLB_PLAYERS"),
  "MLB usa los mismos registros documentados de las fichas mexicanas");
verify(connectionsSource.includes("result.debuts.push") &&
  connectionsSource.includes("result.previousExperience") &&
  connectionsSource.includes("result.prospects"),
  "datos de MLB separan debuts, experiencia anterior y contratos menores");
verify(read("lib/lmbToMlb.ts").includes('name:"Jesús Manuel Broca"') &&
  read("lib/lmbToMlb.ts").includes('organization:"Milwaukee Brewers"'),
  "fuente Olmecas-Milwaukee en registro compartido");
verify(page.includes("getMlbClubNews") && page.includes("news.items.slice(0, 3)"),
  "Resumen muestra noticias MLB propias en tarjetas reales");
verify(css.includes(".clubDirectoryMlb--franchise .clubToMlbHeroLogo") &&
  css.includes("background:transparent;border:0"), "segundo escudo MLB sin placa blanca");
verify(!css.includes(".clubDirectoryMlb .clubToMlbHeroLogo{background:transparent"),
  "LMB conserva su estilo original");
const source = read("lib/mlbClubContent.ts");
verify(source.includes("/venues/") && source.includes("fieldInfo?.capacity"),
  "capacidad se obtiene del estadio MLB");
verify(source.includes("/feeds/news/rss.xml") && source.includes('url.startsWith("https://www.mlb.com/")'),
  "RSS oficial por club sin mezcla de fuentes");
verify(source.includes("/stats?stats=season&season=") &&
  source.includes("hitting") && source.includes("pitching"),
  "estadisticas por equipo y temporada desde MLB StatsAPI");
verify(read("lib/mlbClubContent.ts").includes("statsapi.mlb.com/api/v1"),
  "datos MLB desde fuente oficial");
verify(page.includes("getMlbClub(Number(id))"), "validacion de id de franquicia");
process.stdout.write("MLB profile standard regression: " + checks + " checks OK.\n");
