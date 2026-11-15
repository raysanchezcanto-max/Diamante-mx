#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MLB_CLUBS } = require("../lib/mlbClubDirectory.ts");
const { translateMlbTransaction } = require("../lib/mlbTransactionSpanish.ts");

let checks = 0;
function verify(condition, message) { assert.ok(condition, message); checks++; }

const cases = [
  ["Tampa Bay Rays activated RHP Joe Boyle.", "Status Change", "Joe Boyle", "Activación", "activó a Joe Boyle (lanzador derecho)"],
  ["Tampa Bay Rays activated LHP Shane McClanahan from the 15-day injured list.", "Status Change", "Shane McClanahan", "Activación", "lista de lesionados de 15 días"],
  ["Tampa Bay Rays optioned RHP Joe Boyle to Durham Bulls.", "Minor League Options", "Joe Boyle", "Asignación a ligas menores", "envió a Joe Boyle"],
  ["Tampa Bay Rays recalled C Kenny Piper from Durham Bulls.", "Status Change", "Kenny Piper", "Llamado al equipo", "llamó de ligas menores"],
  ["Tampa Bay Rays placed RF Kenny Piper on the 10-day injured list.", "Status Change", "Kenny Piper", "Lista de lesionados", "lista de lesionados de 10 días"],
  ["Tampa Bay Rays designated SS Joe Boyle for assignment.", "Status Change", "Joe Boyle", "Designación para asignación", "designó a Joe Boyle (campocorto)"],
  ["Tampa Bay Rays signed free agent C Kenny Piper to a minor league contract.", "Signing", "Kenny Piper", "Contratación", "agente libre"],
  ["Tampa Bay Rays claimed RHP Joe Boyle off waivers.", "Waiver", "Joe Boyle", "Incorporación", "lista de jugadores disponibles"],
  ["3B Nick Madrigal elected free agency.", "Declared Free Agency", "Nick Madrigal", "Agencia libre", "optó por declararse agente libre"],
  ["Tampa Bay Rays sent RHP Jonathan Heasley outright to Durham Bulls.", "Outrighted", "Jonathan Heasley", "Asignación definitiva", "de forma definitiva a Durham Bulls"],
  ["Tampa Bay Rays traded RHP Evan Reifert to Houston Astros for cash.", "Trade", "Evan Reifert", "Intercambio", "con Houston Astros a cambio de dinero"],
  ["Tampa Bay Rays traded RHP Evan Reifert to Houston Astros for cash.", "Trade", null, "Intercambio", "Evan Reifert (lanzador derecho)"],
  ["Tampa Bay Rays selected the contract of RF Jack Suwinski from Durham Bulls.", "Selected", "Jack Suwinski", "Selección de contrato", "procedente de Durham Bulls"],
  ["Atlanta Braves selected the contract of Danny Young from Gwinnett Stripers.", "Selected", "Danny Young", "Selección de contrato", "Danny Young para su plantilla"],
  ["Unknown MLB transaction that is not parsed.", "Status Change", "Joe Boyle", "Cambio de estatus", "movimiento de plantilla"],
  ["Unknown MLB transaction that is not parsed.", "Weird Unknown Type", null, "Movimiento de plantilla", "Consulta la fuente"],
];
for (const [source, type, person, expectedLabel, snippet] of cases) {
  const output = translateMlbTransaction(source, type, person, "Tampa Bay Rays");
  verify(output.label === expectedLabel, "etiqueta en español: " + source);
  verify(output.description.includes(snippet), "descripción en español: " + source);
  verify(!/\b(activated|recalled|optioned|placed|status change|RHP|LHP|off waivers|free agent)\b/i.test(
    output.label + " " + output.description), "sin términos ingleses: " + source);
}
const missingPosition = translateMlbTransaction(
  "Atlanta Braves selected the contract of Danny Young from Gwinnett Stripers.",
  "Selected", "Danny Young", "Atlanta Braves",
);
verify(!missingPosition.description.includes("jardinero"),
  "la preposición inglesa 'of' no se confunde con el código de posición OF");

verify(MLB_CLUBS.length === 30, "catálogo MLB contiene 30 equipos");
for (const club of MLB_CLUBS) {
  const localized = translateMlbTransaction(
    club.name + " activated RHP Example Player.", "Status Change", "Example Player", club.name);
  verify(localized.label === "Activación" && localized.description.includes("lanzador derecho"),
    "una sola traducción para " + club.name);
}

const page = fs.readFileSync(path.join(__dirname, "../app/equipos/mlb/[id]/page.tsx"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "../app/globals.css"), "utf8");
const source = fs.readFileSync(path.join(__dirname, "../lib/mlbClubContent.ts"), "utf8");
verify(page.includes("clubMovementsContent--mlb"), "estilo de movimientos MLB aislado");
verify(css.includes(".clubProfile--all .clubMovementsContent--mlb .clubMovementBody>img"),
  "insignia MLB sin placa blanca");
verify(source.includes("translateMlbTransaction") && source.includes("spanishHeadline"),
  "movimientos y noticias pasan por traducción");
verify(!page.includes("pueden estar en inglés"), "la interfaz no advierte inglés sin traducir");
process.stdout.write("MLB en español: " + checks + " verificaciones OK.\n");
