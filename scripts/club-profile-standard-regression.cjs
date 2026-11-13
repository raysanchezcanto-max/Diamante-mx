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
 "components/LmpTomaterosEditorialHistory.tsx",
 "components/LmpYaquisEditorialHistory.tsx",
 "components/LmpCanerosEditorialHistory.tsx",
 "components/LmpVenadosEditorialHistory.tsx",
 "components/LmpJaguaresEditorialHistory.tsx",
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
// Additional profile pages must share copy AND column order (calendar before record).
const pages=[
 "app/equipos/lmb/[slug]/page.tsx",
 "app/equipos/lmp/algodoneros/page.tsx",
 "components/LmpDirectoryClubProfile.tsx"
];
for(const p of pages){
 const text=read(p);
 const required=[
   "COPY.summary.calendarKicker",
   "COPY.summary.calendarTitle",
   "COPY.summary.recordTitle",
   "COPY.summary.newsTitle",
   "COPY.summary.videosKicker",
   "COPY.summary.videosTitle",
   "COPY.summary.headlineTitle",
   "COPY.roster.title",
   "COPY.movements.kicker",
   "COPY.movements.title"
 ];
 for(const symbol of required){
  assert(text.includes(symbol),p+" missing shared section copy: "+symbol);n++;
 }
 const calendar=text.indexOf("clubCalendarPanel");
 const record=text.indexOf("clubRecordPanel");
 assert(calendar>=0 && record>calendar,p+" must show calendar before standings record");n++;
}
const special=read("app/equipos/lmb/algodoneros/page.tsx");
for(const symbol of ["COPY.summary.calendarKicker","COPY.summary.calendarTitle","COPY.summary.recordTitle","COPY.summary.newsTitle","COPY.summary.videosKicker","COPY.summary.videosTitle","COPY.summary.headlineTitle","COPY.roster.title","COPY.movements.kicker","COPY.movements.title"]){
 assert(special.includes(symbol),"Union Laguna bespoke page must use "+symbol);n++;
}
assert(special.indexOf("clubCalendarPanel")<special.indexOf("clubRecordPanel"),"Union Laguna must show calendar before record");n++;
const specialMlb=read("components/AlgodonerosGrandesLigas.tsx");
for(const symbol of ["COPY.mlb.kicker","COPY.mlb.title","COPY.mlb.intro","COPY.mlb.minorKicker","COPY.mlb.minorTitle"]){
 assert(specialMlb.includes(symbol),"Union Laguna MLB page must use "+symbol);n++;
}
const lexicon=read("lib/clubProfileCopy.ts");
for(const phrase of ["Próximos juegos","Actualidad del equipo","Videos destacados","Balance del equipo","Movimientos de ","Jugadores de "]){
 assert(lexicon.includes(phrase),"missing common label "+phrase);n++;
}

console.log("OK "+n+" club profile standard checks (History + shared headings and Summary order).");
