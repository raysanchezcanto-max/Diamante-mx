#!/usr/bin/env node
"use strict";
// Live, non-destructive source audit. Run manually with npm run audit:lmp-profiles.
// Not part of the Vercel build because source downtime should not block deploys.
const fs=require("node:fs");
const path=require("node:path");

const root=path.resolve(__dirname,"..");
const directory=fs.readFileSync(path.join(root,"lib/lmpClubDirectory.ts"),"utf8");
const clubs=[...directory.matchAll(/slug:"([a-z]+)",id:(\d+)/g)]
 .map(([,slug,id])=>({slug,id:Number(id)}));
clubs.push({slug:"algodoneros",id:5482});
const tags={
 aguilas:"aguilas-de-mexicali",naranjeros:"naranjeros-de-hermosillo",
 yaquis:"yaquis-de-obregon",caneros:"caneros-de-los-mochis",
 tomateros:"tomateros-de-culiacan",venados:"venados-de-mazatlan",
 jaguares:"jaguares-de-nayarit",charros:"charros-de-jalisco",
 mayos:"mayos-de-navojoa",algodoneros:"algodoneros-de-guasave"
};
const editorial={
 aguilas:"Aguilas",naranjeros:"Naranjeros",yaquis:"Yaquis",caneros:"Caneros",
 tomateros:"Tomateros",venados:"Venados",jaguares:"Jaguares",charros:"Charros",
 mayos:"Mayos",algodoneros:"Algodoneros"
};
async function get(url,json=true){
 try{
  const r=await fetch(url,{signal:AbortSignal.timeout(17000),headers:{Accept:json?"application/json":"application/rss+xml"}});
  if(!r.ok)return {error:"HTTP "+r.status};
  return json?await r.json():await r.text();
 }catch(error){return {error:error.message};}
}
const now=new Date();
const day=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Mexico_City",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
const end=new Date(now.getTime()+35*86400000).toISOString().slice(0,10);
const league="https://api.lmp.mx/3.0.0/";
const stats="https://statsapi.mlb.com/api/v1/";

async function main(){
 if(clubs.length!==10||new Set(clubs.map(c=>c.slug)).size!==10)throw Error("Expected 10 unique LMP clubs");
 const standing=await get(stats+"standings?leagueId=132&season=2026&standingsTypes=regularSeason&hydrate=team");
 const records=standing.records?.flatMap(r=>r.teamRecords??[])??[];
 const rows=await Promise.all(clubs.map(async({slug,id})=>{
  const [roster,movements,news,games]=await Promise.all([
   get(league+`teams/${id}/roster`),
   get(league+`teams/${id}/movements?limit=1`),
   get(`https://editor.lmp.mx/tag/${tags[slug]}/rss/`,false),
   get(stats+`schedule?sportId=17&leagueId=132&teamId=${id}&startDate=${day}&endDate=${end}`)
  ]);
  const registered=roster.response??[];
  const active=Array.isArray(registered)?registered.filter(p=>p.playerStatus==="active").length:0;
  const ids=Array.isArray(registered)?registered.filter(p=>p.playerStatus==="active")
   .map(p=>Number(p.playerMLBamID)).filter(n=>Number.isSafeInteger(n)&&n>0).slice(0,45):[];
  const mlb=ids.length?await get(stats+`people?personIds=${ids.join(",")}`):{people:[]};
  const mlbDebuts=mlb.people?.filter(p=>Boolean(p.mlbDebutDate)).length;
  const editorialExists=fs.existsSync(path.join(root,`components/Lmp${editorial[slug]}EditorialHistory.tsx`));
  return {equipo:slug,resumen:
    `${typeof news==="string"?(news.match(/<item>/g)||[]).length:"ERROR"} noticias / ${records.some(r=>r.team?.id===id)?"tabla":"sin tabla"} / ${games.dates?.flatMap(d=>d.games??[]).length??"ERROR"} juegos`,
   plantilla:active,movimientos:movements.response?.total??"ERROR",
   grandesLigas:typeof mlbDebuts==="number"?`${mlbDebuts} fichas MLB verificadas`:"ERROR",
   historia:editorialExists?"editorial":"FALTA"};
 }));
 console.table(rows);
 const failures=rows.filter(r=>r.plantilla===0||typeof r.movimientos!=="number"||r.movimientos===0||r.historia!=="editorial"||r.resumen.includes("ERROR")||r.resumen.includes("sin tabla")||r.grandesLigas==="ERROR");
 console.log(`Auditados ${rows.length} equipos de LMP y sus 5 apartados; ${failures.length} equipos con fuentes o módulos pendientes.`);
 if(failures.length)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
