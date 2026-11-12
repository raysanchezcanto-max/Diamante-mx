#!/usr/bin/env node
"use strict";
// Regression guard: a developer should not be able to reintroduce one-off
// capacity / venue / season KPIs where a stadium opening year belongs.
const fs=require("node:fs");
const assert=require("node:assert/strict");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const files=[
 "components/LmbClubEditorialHistory.tsx",
 "components/AlgodonerosHistory.tsx",
 "components/LmpAlgodonerosEditorialHistory.tsx",
 "components/LmpNaranjerosEditorialHistory.tsx",
 "components/LmpAguilasEditorialHistory.tsx",
 "components/LmpDirectoryClubProfile.tsx"
];
let n=0;
const shared=read("components/ClubHistoryFacts.tsx");
for(const phrase of ["DEBUT HISTÓRICO {league}","CAMPEONATOS {league}","APERTURA DEL ESTADIO","AÑO DE INAUGURACIÓN","Año por verificar"]){
 assert(shared.includes(phrase),"Missing master wording: "+phrase);n++;
}
for(const p of files){
 const s=read(p);
 for(const label of ["ClubHistoryMetrics","ClubHistoryStadiumYear"]){
  assert(s.includes("<"+label),p+" is not using "+label);n++;
 }
 for(const obsolete of ['className="clubHistoryStats"','className="clubHistoryStadiumMark"']){
  assert(!s.includes(obsolete),p+" has duplicate one-off markup: "+obsolete);n++;
 }
}
const copy=read("lib/clubProfileCopy.ts");
for(const heading of ["EL PALMARÉS","Línea del tiempo","Figuras históricas del club","Inmortales vinculados al club","LA CASA DEL EQUIPO","FUENTES HISTÓRICAS","DEL BÉISBOL MEXICANO AL DIAMANTE INTERNACIONAL"]){
 assert(copy.includes(heading),"Missing shared copy: "+heading);n++;
}
const contract=read("CLUB_PROFILE_STANDARD.md");
assert(contract.includes("APERTURA DEL ESTADIO")&&contract.includes("AÑO DE INAUGURACIÓN"),"Design contract missing");n++;
console.log("OK "+n+" club profile standard checks (LMB/LMP shared History metrics).");
