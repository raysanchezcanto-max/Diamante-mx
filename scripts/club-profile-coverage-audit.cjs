#!/usr/bin/env node
"use strict";
// Inventario de 60 fichas + auditoría HTTP opcional de sus 360 vistas.
// HTTP 200 no acredita biografías completas: se informa esa limitación.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MLB_CLUBS } = require("../lib/mlbClubDirectory.ts");
const { LMB_CLUB_DIRECTORY } = require("../lib/lmbClubs.ts");
const { LMP_CLUB_DIRECTORY } = require("../lib/lmpClubDirectory.ts");
const { mlbEditorialHistory } = require("../lib/mlbHistoryEditorial.ts");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const views = ["resumen", "estadisticas", "plantilla", "movimientos", "grandes-ligas", "historia"];
const clubs = [
  ...MLB_CLUBS.map(c => ({ league: "mlb", id: String(c.id), name: c.name,
    editorialHistory: !!mlbEditorialHistory(c.id) })),
  ...LMB_CLUB_DIRECTORY.map(c => ({ league: "lmb", id: c.slug, name: c.name })),
  ...LMP_CLUB_DIRECTORY.map(c => ({ league: "lmp", id: c.slug, name: c.name })),
  { league: "lmp", id: "algodoneros", name: "Algodoneros de Guasave" },
];
assert.equal(clubs.length, 60, "se esperan 30 MLB + 20 LMB + 10 LMP");
for (const league of ["mlb", "lmb", "lmp"]) {
  assert.equal(clubs.filter(c => c.league === league).length,
    league === "mlb" ? 30 : league === "lmb" ? 20 : 10);
}
for (const file of [
  "app/equipos/mlb/[id]/page.tsx", "app/equipos/lmb/[slug]/page.tsx",
  "app/equipos/lmb/algodoneros/page.tsx", "app/equipos/lmp/[slug]/page.tsx",
  "app/equipos/lmp/algodoneros/page.tsx",
]) {
  const source = read(file) + (file === "app/equipos/lmp/[slug]/page.tsx"
    ? read("components/LmpDirectoryClubProfile.tsx") : "");
  assert(source.includes("clubProfile") && source.includes("grandes-ligas") &&
    source.includes("historia"), `faltan rutas del perfil en ${file}`);
}
assert(read("app/equipos/mlb/[id]/page.tsx").includes("<MlbMexicanConnections"),
  "MLB debe mostrar las conexiones documentadas con México");
assert(!read("components/MlbMexicanConnections.tsx").includes("Bateo colectivo"),
  "las estadísticas no pertenecen a Grandes Ligas");

const missing = clubs.filter(c => c.league === "mlb" && !c.editorialHistory);
console.log("60 perfiles: MLB 30 · LMB 20 · LMP 10; seis pestañas = 360 vistas.");
console.log(`MLB · Historia editorial individual: ${30 - missing.length}/30. Pendientes: ${missing.length}.`);
console.log("Por documentar:", missing.map(c => c.name).join("; "));
console.log("LMB/LMP: las plantillas existen, pero debe verificarse la integridad de fuentes por equipo.");

if (!process.argv.includes("--live")) {
  console.log("Estructura verificada. Usar --live para auditar las 360 URL desplegadas.");
  process.exit(0);
}
const selected = process.argv.find(arg => arg.startsWith("--league="))?.split("=")[1];
if (selected && !["mlb", "lmb", "lmp"].includes(selected)) throw Error("Liga no válida");
const sampleArg = process.argv.find(arg => arg.startsWith("--sample="))?.split("=")[1];
const sample = sampleArg ? Number(sampleArg) : Infinity;
if (!(sample > 0)) throw Error("--sample requiere un entero positivo");
const base = (process.env.DIAMANTE_AUDIT_URL || "https://diamante-mx.vercel.app").replace(/\/$/, "");
const scoped = clubs.filter(c => !selected || c.league === selected);
const targets = scoped.filter((c, index) =>
  scoped.slice(0, index + 1).filter(previous => previous.league === c.league).length <= sample)
  .flatMap(c => views.map(view => ({ ...c, view,
    url: `${base}/equipos/${c.league}/${c.id}?vista=${view}` })));

async function check(target) {
  try {
    const response = await fetch(target.url, { signal: AbortSignal.timeout(18000) });
    const html = await response.text();
    if (!response.ok || !html.includes("clubProfile")) {
      return { ...target, status: "ERROR", detail: `HTTP ${response.status} / falta ficha` };
    }
    if (target.league === "mlb" && target.view === "grandes-ligas" &&
      (!html.includes("Del béisbol mexicano a") || html.includes("Bateo colectivo"))) {
      return { ...target, status: "ERROR", detail: "Contenido de otra categoría" };
    }
    const empty = target.view === "movimientos" &&
      /No hay movimientos verificados|No se recibieron movimientos/i.test(html);
    return { ...target, status: empty ? "DATOS POR REVISAR" : "ESTRUCTURA OK",
      detail: empty ? "Consulta sin movimientos verificados" : "" };
  } catch (error) {
    return { ...target, status: "ERROR", detail: error.message };
  }
}
async function main() {
  const results = [];
  for (let i = 0; i < targets.length; i += 5) {
    results.push(...await Promise.all(targets.slice(i, i + 5).map(check)));
  }
  const problems = results.filter(row => row.status !== "ESTRUCTURA OK");
  console.log(`URLs verificadas: ${results.length}. Incidencias / datos pendientes: ${problems.length}.`);
  console.table(problems.map(row => ({ liga: row.league, equipo: row.name,
    pestaña: row.view, estado: row.status, observación: row.detail })));
  if (problems.some(row => row.status === "ERROR")) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
