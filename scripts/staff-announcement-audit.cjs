#!/usr/bin/env node
"use strict";
/**
 * Auditoría autónoma de comunicados de cuerpo técnico LMB/LMP.
 * Lee únicamente fuentes institucionales identificadas, no edita historial,
 * no publica artículos como operaciones confirmadas y no necesita secretos.
 * Guarda JSON y Markdown para revisión editorial en GitHub Actions.
 */
const fs=require("node:fs");
const path=require("node:path");
const {LMB_CLUB_DIRECTORY}=require("../lib/lmbClubs.ts");
const {LMP_CLUB_DIRECTORY}=require("../lib/lmpClubDirectory.ts");
const {LMP_OFFICIAL_NEWS_TAGS}=require("../lib/lmpOfficialNewsTags.ts");
const {verifiedPersonnelEventsForClub}=require("../lib/verifiedPersonnelEvents.ts");
const {detectStaffAnnouncement,dedupeStaffCandidates}=require("../lib/staffAnnouncementDetection.ts");

const OUT_DIR=path.resolve(process.cwd(),process.env.STAFF_AUDIT_OUTPUT??".audit");
const NOW=new Date();
const STALE_DAYS=120;

function plain(input){
  return input
    .replace(/<[^>]*>/g," ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(_,ent)=>{
      if(ent.startsWith("#")){
        const n=ent[1]?.toLowerCase()==="x"?parseInt(ent.slice(2),16):parseInt(ent.slice(1),10);
        return Number.isInteger(n)&&n>=32&&n<=0x10ffff?String.fromCodePoint(n):" ";
      }
      return {amp:"&",quot:'"',apos:"'",nbsp:" ",lt:"<",gt:">",
        aacute:"á",eacute:"é",iacute:"í",oacute:"ó",uacute:"ú",ntilde:"ñ"}[ent.toLowerCase()]??" ";
    }).replace(/\s+/g," ").trim();
}
async function getText(url,expect){
  const result=await fetch(url,{
    signal:AbortSignal.timeout(14000),
    redirect:"error", // No seguir redirecciones a un sitio ajeno.
    headers:{"accept":expect==="xml"?"application/rss+xml, application/xml, text/xml":"text/html"},
    cache:"no-store",
  });
  if(!result.ok)throw Error("HTTP "+result.status);
  const type=result.headers.get("content-type")??"";
  if(expect==="xml"&&!/(?:xml|rss)/i.test(type))throw Error("Tipo de contenido inesperado: "+type.slice(0,50));
  if(expect==="html"&&!/html/i.test(type))throw Error("Tipo de contenido inesperado: "+type.slice(0,50));
  const body=await result.text();
  if(body.length<180)throw Error("Contenido insuficiente");
  return body;
}
function lmbArticles(html){
  const source=html.split("(self.__next_f")[0];
  const result=[],seen=new Set();
  for(const [start,end] of [[">Noticias principales<",">Top Videos<"],[">Más Noticias<",">Movimientos<"]]){
    const from=source.indexOf(start);
    if(from<0)continue;
    const to=source.indexOf(end,from+start.length);
    const chunk=source.slice(from,to>from?to:Math.min(source.length,from+100000));
    for(const match of chunk.matchAll(/<a\b[^>]*href="(\/noticias\/[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/gi)){
      if(/\/(?:lmb|lms)-movimientos-en-/i.test(match[1])||seen.has(match[1]))continue;
      const frag=match[2];
      const alt=frag.match(/<img\b[^>]*\balt="([^"]+)"/i)?.[1];
      const heading=frag.match(/<h[2-4]\b[^>]*>([\s\S]*?)<\/h[2-4]>/i)?.[1];
      const title=plain(alt??heading??frag);
      if(title.length>=16&&title.length<=240){
        result.push({title,url:"https://lmb.com.mx"+match[1],publishedAt:null});
        seen.add(match[1]);
      }
      if(result.length>=40)break;
    }
  }
  return result;
}
function element(xml,key){
  const re=new RegExp("<"+key+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/"+key+">","i");
  return (xml.match(re)?.[1]??"").replace(/^<!\[CDATA\[|\]\]>$/g,"").trim();
}
function lmpArticles(xml){
  const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0,60);
  return items.flatMap(([_,block])=>{
    const title=plain(element(block,"title"));
    const url=plain(element(block,"link"));
    const date=element(block,"pubDate");
    const publishedAt=Number.isFinite(Date.parse(date))?new Date(date).toISOString():null;
    if(!title||!url||!publishedAt)return [];
    // Limitar la auditoría a noticias recientes sin inventar vigencia.
    if(Math.abs(NOW.getTime()-Date.parse(publishedAt))>STALE_DAYS*86400000)return [];
    return [{title,url,publishedAt}];
  });
}
async function scanClub(club){
  const source=club.league==="LMB"
    ? "https://lmb.com.mx/equipos/"+club.slug
    : "https://editor.lmp.mx/tag/"+LMP_OFFICIAL_NEWS_TAGS[club.id]+"/rss/";
  if(!source||source.includes("undefined"))throw Error("Etiqueta oficial no registrada");
  const body=await getText(source,club.league==="LMB"?"html":"xml");
  const articles=club.league==="LMB"?lmbArticles(body):lmpArticles(body);
  const verifiedUrls=verifiedPersonnelEventsForClub(club.league,club.slug).map(e=>e.url);
  const detected=articles.flatMap(article=>{
    const item=detectStaffAnnouncement({...article,league:club.league,clubSlug:club.slug},verifiedUrls);
    return item?[item]:[];
  });
  return {source,read:articles.length,detected};
}
async function main(){
  const clubs=[
    ...LMB_CLUB_DIRECTORY.map(c=>({league:"LMB",slug:c.slug,name:c.name})),
    ...LMP_CLUB_DIRECTORY.map(c=>({league:"LMP",slug:c.slug,id:c.id,name:c.name})),
    {league:"LMP",slug:"algodoneros",id:5482,name:"Algodoneros de Guasave"}
  ];
  const candidates=[],failures=[],sources=[];
  for(let i=0;i<clubs.length;i+=4){
    const batch=await Promise.all(clubs.slice(i,i+4).map(async club=>{
      try{return {club,result:await scanClub(club)};}
      catch(err){return {club,error:err instanceof Error?err.message:String(err)};}
    }));
    for(const item of batch){
      if(item.error){
        failures.push({league:item.club.league,club:item.club.slug,error:item.error});
      }else{
        sources.push({league:item.club.league,club:item.club.slug,
          source:item.result.source,articlesRead:item.result.read});
        candidates.push(...item.result.detected);
      }
    }
  }
  const distinct=dedupeStaffCandidates(candidates);
  const pending=distinct.filter(x=>x.status==="pending_review");
  const already=distinct.filter(x=>x.status==="already_verified");
  const report={
    generatedAt:NOW.toISOString(),
    policy:"Solo detección editorial. NINGÚN candidato se publica automáticamente como confirmado.",
    coverage:{expected:clubs.length,success:sources.length,failures:failures.length},
    summary:{pendingReview:pending.length,previouslyVerified:already.length,articlesRead:sources.reduce((a,b)=>a+b.articlesRead,0)},
    candidates:distinct,failures,sources
  };
  const esc=x=>String(x??"").replace(/[\r\n|]/g," ").replace(/[<>]/g,"").replace(/[\[\]]/g,"").slice(0,240);
  const md=[
    "# Auditoría de candidatos a movimientos de cuerpo técnico",
    "",
    "**Generado:** "+report.generatedAt,
    "**Cobertura:** "+sources.length+"/"+clubs.length+" fuentes oficiales.",
    "**Candidatos pendientes:** "+pending.length+" · **Ya documentados:** "+already.length+".",
    "",
    "> Ningún candidato queda confirmado por este informe. Se requiere verificar el comunicado completo, persona, equipo, cargo, fecha, negaciones, estado y cambios posteriores antes de actualizar Diamante MX.",
    "",
    "## Pendientes de revisión",
    "",
    "| Liga | Club | Tipo sugerido | Fecha RSS | Titular | URL oficial |",
    "|---|---|---|---|---|---|"
  ];
  for(const item of pending){
    md.push("| "+[item.league,item.clubSlug,item.proposedKind,
      item.publishedAt?.slice(0,10)??"Sin fecha verificable",
      esc(item.title),item.url].join(" | ")+" |");
  }
  if(!pending.length)md.push("| — | — | — | — | No se identificaron candidatos nuevos en las fuentes consultadas | — |");
  md.push("","## Ya documentados","",
    ...already.map(item=>"- "+item.league+" / "+item.clubSlug+" · "+esc(item.title)+" · "+item.url),
    "","## Fuentes no verificables","",
    ...failures.map(f=>"- "+f.league+" / "+f.club+": "+esc(f.error)),
    "","**Nota:** LMB no proporciona una fecha individual verificable en su listado de titulares; no asignar la fecha de ejecución como fecha del anuncio.");
  if(!failures.length)md.push("- Sin fallos de consulta");
  fs.mkdirSync(OUT_DIR,{recursive:true});
  fs.writeFileSync(path.join(OUT_DIR,"staff-audit.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(OUT_DIR,"staff-audit.md"),md.join("\n")+"\n");
  console.log("Auditoría cuerpo técnico: "+sources.length+"/"+clubs.length+" fuentes; "+
    pending.length+" candidatos pendientes; "+already.length+" ya verificados; "+failures.length+" errores.");
  // Fallos extensos dejan una alerta en CI, pero siempre se conserva el artefacto.
  if(failures.length>=10)process.exitCode=1;
}
main().catch(error=>{console.error("Fallo del auditor:",error);process.exitCode=1;});
