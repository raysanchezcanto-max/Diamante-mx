#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { localizeLmpMovement, spanishBaseballRole } = require("../lib/baseballSpanishTerms.ts");

const cases = [
  ["Venados de Mazatlán informa los movimientos en su roster", "en su plantilla"],
  ["A partir de hoy inactivamos al infield Santiago Gómez", "al jugador de cuadro Santiago Gómez"],
  ["El infielder Iván Lozano entra al roster", "El jugador de cuadro Iván Lozano entra a la plantilla"],
  ["El coach Edgar Osuna fue activado", "El entrenador Edgar Osuna fue activado"],
  ["inactivanco a Rubén Reyes", "inactivando a Rubén Reyes"],
  ["El pitcher zurdo y catcher participaron", "El lanzador zurdo y receptor participaron"],
  ["toma su lugar en roster de activos", "toma su lugar en la plantilla de activos"],
  ["Desactiva de roster a Roel Ramírez", "Desactiva de la plantilla a Roel Ramírez"],
  ["Coloca a Abraham (D/D, IF, Tijuana) en su lista de academia rookie", "(D/D, jugador de cuadro, Tijuana) en su lista de academia de novatos"],
  ["Da de baja a un jugador por waiver", "por lista de jugadores disponibles"],
];
let count = 0;
for (const [source, expected] of cases) {
  const output = localizeLmpMovement(source);
  assert.ok(output.includes(expected), "texto LMP en español: " + source);
  count++;
}
for (const [source, expected] of [
  ["Pitcher", "Lanzador"], ["Catcher", "Receptor"], ["Infielder", "Jugador de cuadro"],
  ["Outfielder", "Jardinero"], ["Shortstop", "Campocorto"], ["Designated Hitter", "Bateador designado"],
]) {
  assert.equal(spanishBaseballRole(source), expected);
  count++;
}
const page = fs.readFileSync(path.join(__dirname, "../components/LmpDirectoryClubProfile.tsx"), "utf8");
assert.ok(page.includes("Plantillas oficiales ↗") && page.includes("Peloteros de la plantilla"));
count++;
const source = fs.readFileSync(path.join(__dirname, "../lib/lmpClubDirectoryData.ts"), "utf8");
assert.ok(source.includes("localizeLmpMovement(description)") && source.includes("spanishBaseballRole("));
count++;
process.stdout.write("Vocabulario de perfiles LMP: " + count + " verificaciones OK.\n");
