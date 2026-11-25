#!/usr/bin/env node
"use strict";
/** Decisiones editoriales: rechazo cierra issue; aprobación crea PR draft.
 * Nunca confirma por título ni hace merge.
 */
const fs=require("node:fs");
const {candidateKey}=require("./staff-review-issues.cjs");
const {LMB_CLUB_DIRECTORY}=require("../lib/lmbClubs.ts");
const {LMP_CLUB_DIRECTORY}=require("../lib/lmpClubDirectory.ts");
const {verifiedPersonnelEventsForClub}=require("../lib/verifiedPersonnelEvents.ts");
const kinds=["appointment","ratification","replacement","interim","departure",
  "dismissal","resignation","coach-addition","coach-departure"];

function parseReview(issue){
  if(issue?.user?.login!=="github-actions[bot]")
    throw Error("Solo incidencias originadas por el auditor oficial");
  const body=String(issue.body??"");
  const marker=body.match(/<!-- STAFF_CANDIDATE_KEY:([a-f0-9]{20}) -->/);
  const ticks=String.fromCharCode(96).repeat(3);
  const block=body.match(new RegExp(ticks+"json\\s*(\\{[\\s\\S]{1,6000}?\\})\\s*"+ticks,"i"));
  if(!marker||!block)throw Error("Plantilla editorial ausente");
  const event=JSON.parse(block[1]);
  if(event.schema!=="diamante-staff-review-v1"||
      event.candidateKey!==marker[1]||
      event.candidateKey!==candidateKey({
        league:event.league,clubSlug:event.clubSlug,url:event.articleUrl,
      }))throw Error("Identidad del artículo alterada");
  return event;
}
function normalizeEvent(entry){
  const value=key=>typeof entry[key]==="string"?entry[key].trim():"";
  const event={
    league:value("league"),clubSlug:value("clubSlug"),
    date:value("date"),person:value("person"),role:value("role"),
    kind:value("kind"),effectiveSeason:value("effectiveSeason"),
    url:value("articleUrl"),description:value("description"),
    replaces:value("replaces"),
  };
  const clubs=event.league==="LMB"?LMB_CLUB_DIRECTORY:
    event.league==="LMP"?[...LMP_CLUB_DIRECTORY,{slug:"algodoneros"}]:[];
  if(!clubs.some(c=>c.slug===event.clubSlug))throw Error("Liga/club desconocidos");
  if(!kinds.includes(event.kind))throw Error("Tipo no reconocido");
  const date=new Date(event.date+"T12:00:00Z");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(event.date)||
      !Number.isFinite(date.getTime())||
      date.toISOString().slice(0,10)!==event.date||
      date.getTime()>Date.now()+86400000||
      date.getUTCFullYear()<2020)throw Error("Fecha de anuncio obligatoria e inválida");
  if(event.person.length<5||event.person.length>115||
      event.person.split(/\s+/).length<2)throw Error("Nombre completo obligatorio");
  if(event.role.length<3||event.role.length>90)throw Error("Cargo obligatorio");
  if(!/^[\dA-Za-zÁÉÍÓÚÜÑáéíóúüñ– -]{4,30}$/.test(event.effectiveSeason))
    throw Error("Temporada obligatoria");
  if(event.description.length<45||event.description.length>500||
      !event.description.toLowerCase().includes(event.person.toLowerCase()))
    throw Error("Descripción específica de la fuente obligatoria");
  if(/\b(?:rumor|podr[ií]a|sin confirmar|se perfila)\b/i.test(event.description))
    throw Error("No se publican rumores");
  if(event.kind==="replacement"&&!event.replaces)throw Error("Falta persona reemplazada");
  if(event.replaces.length>100)throw Error("Reemplazo demasiado largo");
  let url;
  try{url=new URL(event.url);}catch{throw Error("URL inválida");}
  const allowed=event.league==="LMB"
    ?url.hostname==="lmb.com.mx"&&/^\/noticias\/[a-z0-9-]+\/?$/.test(url.pathname)
    :url.hostname==="editor.lmp.mx"&&/^\/[a-z0-9-]+\/$/.test(url.pathname);
  if(url.protocol!=="https:"||url.search||url.hash||!allowed)
    throw Error("Fuente primaria no válida");
  if(verifiedPersonnelEventsForClub(event.league,event.clubSlug)
      .some(e=>e.url===event.url))throw Error("Comunicado ya registrado");
  return event;
}
function insertVerifiedEvent(source,entry){
  const event=normalizeEvent(entry);
  if(source.includes(JSON.stringify(event.url)))throw Error("URL duplicada");
  const anchor="const EVENTS: readonly VerifiedPersonnelEvent[] = [\n";
  if(!source.includes(anchor))throw Error("No se localizó el registro");
  const fields=["league","clubSlug","date","person","role","kind","effectiveSeason","url","description"];
  if(event.replaces)fields.push("replaces");
  const item="  {\n"+fields.map(k=>"    "+k+":"+JSON.stringify(event[k])+",").join("\n")+"\n  },\n";
  return source.replace(anchor,anchor+item);
}
const api=async (repo,endpoint,options={})=>{
  const token=process.env.GITHUB_TOKEN;
  if(!token)throw Error("Falta GITHUB_TOKEN");
  const response=await fetch("https://api.github.com/repos/"+repo+endpoint,{
    ...options,
    headers:{Accept:"application/vnd.github+json",Authorization:"Bearer "+token,
      "X-GitHub-Api-Version":"2022-11-28",
      "User-Agent":"diamante-editorial-decision",...options.headers},
    signal:AbortSignal.timeout(17000),
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw Error("GitHub HTTP "+response.status+": "+JSON.stringify(result).slice(0,320));
  return result;
};
const write=(repo,endpoint,method,body)=>api(repo,endpoint,{
  method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body),
});
async function main(){
  const repo=process.env.GITHUB_REPOSITORY??"";
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo))throw Error("Repositorio inválido");
  const payload=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,"utf8"));
  const issue=payload.issue,label=payload.label?.name;
  if(!issue||issue.pull_request||
      !["editorial-aprobado","editorial-descartado"].includes(label))return;
  const actor=process.env.GITHUB_ACTOR??"";
  if(!actor||actor.endsWith("[bot]"))
    throw Error("Requiere revisión humana");
  const permission=await api(repo,"/collaborators/"+encodeURIComponent(actor)+"/permission");
  if(!["admin","maintain","write"].includes(permission.permission))
    throw Error("El revisor requiere permiso write o superior");
  const record=parseReview(issue),number=issue.number;
  if(issue.labels?.some(l=>l.name===(label==="editorial-aprobado"?
       "editorial-descartado":"editorial-aprobado")))
    throw Error("Decisiones editoriales contradictorias");
  if(label==="editorial-descartado"){
    await write(repo,"/issues/"+number+"/comments","POST",{
      body:"Descartado por revisión editorial. No se modificó Diamante MX.",
    });
    await write(repo,"/issues/"+number,"PATCH",{state:"closed",state_reason:"not_planned"});
    console.log("Descartado: issue #"+number);return;
  }
  if(issue.state!=="open")throw Error("Incidencia cerrada");
  const entry=normalizeEvent(record),filepath="lib/verifiedPersonnelEvents.ts";
  const current=await api(repo,"/contents/"+filepath+"?ref=main");
  const content=Buffer.from(current.content,"base64").toString("utf8");
  const updated=insertVerifiedEvent(content,entry);
  const branch="editorial/staff-"+number+"-"+record.candidateKey.slice(0,6);
  const target=await api(repo,"/git/ref/heads/main");
  await write(repo,"/git/refs","POST",{ref:"refs/heads/"+branch,sha:target.object.sha});
  await write(repo,"/contents/"+filepath,"PUT",{
    message:"Proponer "+entry.kind+" de "+entry.person+" (#"+number+")",
    content:Buffer.from(updated).toString("base64"),sha:current.sha,branch,
  });
  const pr=await write(repo,"/pulls","POST",{
    title:"Revisión de movimiento · "+entry.person+" · "+entry.league,
    head:branch,base:"main",draft:true,
    body:"Propuesta respaldada por revisión editorial de #"+number+
      ".\n\n**Validar antes de fusionar:** "+entry.url+
      "\n\nRevisar cargo, club, fecha, temporada y posteriores rectificaciones."+
      "\n\nLa aprobación NO publica el movimiento; se exige revisar y fusionar la PR.",
  });
  await write(repo,"/issues/"+number+"/comments","POST",{
    body:"Propuesta generada: "+pr.html_url+
      ". Pendiente de revisión y merge; aún no publicada en Diamante MX.",
  });
  await write(repo,"/issues/"+number+"/labels","POST",{labels:["editorial-pr"]});
  console.log("PR draft #"+pr.number+" creada; merge manual obligatorio");
}
if(require.main===module){
  main().catch(error=>{console.error("Aprobación no aplicada:",error);process.exitCode=1;});
}
module.exports={parseReview,normalizeEvent,insertVerifiedEvent};
