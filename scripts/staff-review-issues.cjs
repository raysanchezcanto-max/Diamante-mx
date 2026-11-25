#!/usr/bin/env node
"use strict";
/** Convierte candidatos no verificados en incidencias editoriales.
 * Nunca cambia el historial público ni concede una confirmación.
 */
const fs = require("node:fs");
const path = require("node:path");
const {createHash} = require("node:crypto");
const labelConfig = Object.freeze({
 "editorial-pendiente": {color:"FBCA04",description:"Candidato por verificar; no confirmado"},
 "editorial-aprobado": {color:"0E8A16",description:"Revisión aprobada; pendiente de PR y merge"},
 "editorial-descartado": {color:"B60205",description:"No debe integrarse al historial"},
 "editorial-pr": {color:"5319E7",description:"Propuesta creada; pendiente de revisión"},
});
const esc = v => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g," ")
  .replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,260);
const candidateKey = item => createHash("sha256")
  .update([item.league,item.clubSlug,item.url].join("|")).digest("hex").slice(0,20);

function reviewIssueTemplate(item) {
  if (item.status !== "pending_review" ||
      !["LMB","LMP"].includes(item.league) ||
      !/^[a-z0-9-]{2,50}$/.test(item.clubSlug) ||
      !/^https:\/\//.test(item.url)) throw Error("Candidato inválido");
  const key = candidateKey(item);
  const title = "POR VERIFICAR · "+item.league+" · "+item.clubSlug+" · "+esc(item.title).slice(0,98);
  const review = {
    schema:"diamante-staff-review-v1",candidateKey:key,
    league:item.league,clubSlug:item.clubSlug,
    articleUrl:item.url,proposedKind:item.proposedKind,
    person:"",role:"",kind:"",date:"",effectiveSeason:"",
    description:"",replaces:""
  };
  const ticks=String.fromCharCode(96).repeat(3);
  const body=[
    "<!-- STAFF_CANDIDATE_KEY:"+key+" -->",
    "# Revisión editorial · NO CONFIRMADO",
    "",
    "**El detector ha encontrado un TITULAR CANDIDATO, no un nombramiento probado.**",
    "La página pública de Diamante MX no cambia por abrir esta incidencia.",
    "",
    "- Liga: **"+item.league+"** · Equipo: **"+item.clubSlug+"**",
    "- Acción propuesta por el detector: **"+esc(item.proposedKind)+"** (debe revisarse)",
    "- Titular: "+esc(item.title),
    "- Fuente detectada: "+item.url,
    "- Fecha del RSS: "+(item.publishedAt?.slice(0,10) ?? "NO INDICADA: consultar comunicado completo"),
    "",
    "## Checklist antes de aprobar",
    "",
    "- [ ] Abrí el artículo original y confirmé que es un anuncio, no una especulación ni una negación",
    "- [ ] Verifiqué nombre completo, club, cargo y significado preciso del movimiento",
    "- [ ] Comprobé fecha real del anuncio y temporada de aplicación",
    "- [ ] Revisé comunicados posteriores y posibles sustituciones/rectificaciones",
    "- [ ] Confirmé que no existe ya el mismo evento en el historial",
    "",
    "## Datos estructurados para generar una propuesta de cambio",
    "",
    "Completar los campos vacíos del bloque JSON. NO cambiar liga, equipo, URL ni candidateKey. La etiqueta editorial-aprobado solicita una PR; no publica automáticamente.",
    "",
    ticks+"json",JSON.stringify(review,null,2),ticks,
    "",
    "**Acciones:** aplicar editorial-descartado para cerrar sin publicación, o editorial-aprobado tras comprobar la fuente y completar los datos. Se generará una propuesta para revisión final antes de incorporarla.",
  ].join("\n");
  return {key,title,body,labels:["editorial-pendiente"]};
}
const api = async (endpoint,options={})=>{
  const token=process.env.GITHUB_TOKEN;
  if(!token)throw Error("Falta GITHUB_TOKEN");
  const response=await fetch("https://api.github.com"+endpoint,{
    ...options,
    headers:{Accept:"application/vnd.github+json",Authorization:"Bearer "+token,
      "X-GitHub-Api-Version":"2022-11-28","User-Agent":"diamante-staff-editorial-audit",
      ...options.headers},
    signal:AbortSignal.timeout(16000),
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error("GitHub HTTP "+response.status+": "+JSON.stringify(data).slice(0,240));
  return data;
};
const repo=()=>{const name=process.env.GITHUB_REPOSITORY??"";
  if(!/^[\w.-]+\/[\w.-]+$/.test(name))throw Error("GITHUB_REPOSITORY inválido");return "/repos/"+name;
};
async function ensureLabels(){
  const base=repo();
  for(const [name,meta] of Object.entries(labelConfig)){
    try{await api(base+"/labels/"+encodeURIComponent(name));}
    catch(error){
      if(!String(error).includes("HTTP 404"))throw error;
      try{await api(base+"/labels",{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,...meta})});}
      catch(e){if(!String(e).includes("HTTP 422"))throw e;}
    }
  }
}
async function existingCandidateKeys(){
  const found=new Set(),base=repo();
  let finished=false;
  for(let page=1;page<=15;page++){
    const issues=await api(base+"/issues?state=all&per_page=100&page="+page);
    if(!Array.isArray(issues))throw Error("Listado de incidencias no disponible");
    for(const issue of issues){
      if(issue.pull_request)continue;
      const m=String(issue.body??"").match(/<!-- STAFF_CANDIDATE_KEY:([a-f0-9]{20}) -->/);
      if(m)found.add(m[1]);
    }
    if(issues.length<100){finished=true;break;}
  }
  if(!finished)throw Error("Paginación de incidencias incompleta: no crear duplicados");
  return found;
}
async function main(){
  const output=process.env.STAFF_AUDIT_OUTPUT??".audit";
  const report=JSON.parse(fs.readFileSync(path.resolve(output,"staff-audit.json"),"utf8"));
  if(report.coverage?.failures>=10 || report.coverage?.success<20)
    throw Error("Cobertura insuficiente para generar incidencias editoriales");
  const pending=(report.candidates??[]).filter(x=>x.status==="pending_review");
  // Limitar volumen de issues; todos los candidatos permanecen en el informe.
  const MAX_NEW_ISSUES=15;
  await ensureLabels();
  const keys=await existingCandidateKeys();
  let created=0,skipped=0;
  for(const item of pending){
    const issue=reviewIssueTemplate(item);
    if(keys.has(issue.key)||created>=MAX_NEW_ISSUES){skipped++;continue;}
    await api(repo()+"/issues",{method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({title:issue.title,body:issue.body,labels:issue.labels})});
    keys.add(issue.key);created++;
  }
  console.log("Bandeja editorial: "+created+" nuevas, "+skipped+
    " repetidas/no emitidas, "+pending.length+" candidatas en el informe. NO publicadas.");
}
if(require.main===module){
  main().catch(error=>{console.error("Error creando bandeja editorial:",error);process.exitCode=1;});
}
module.exports={candidateKey,reviewIssueTemplate};
