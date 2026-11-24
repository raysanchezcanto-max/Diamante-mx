#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const mlb=require("../lib/mlbClubDirectory.ts").MLB_CLUBS;
const lmb=require("../lib/lmbClubs.ts").LMB_CLUB_DIRECTORY;
const lmp=require("../lib/lmpClubDirectory.ts").LMP_CLUB_DIRECTORY;
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
check(mlb.length===30,"30 clubs MLB");
check(lmb.length===20,"20 clubs LMB");
check(lmp.length===9,"9 directory clubs LMP plus Guasave");
const mlbSource=read("lib/mlbClubContent.ts");
const {isReportedMlbHeadline}=require("../lib/mlbNewsAttribution.ts");
check(isReportedMlbHeadline("Yankees reach 1-year deal with Suter (source)"),
  "MLB source-attributed Yankees signing story is a report");
check(isReportedMlbHeadline("Hill agrees to 1-year deal (reports)"),
  "MLB plural report attribution is recognized");
check(!isReportedMlbHeadline("Yankees confirm official roster move"),
  "MLB unqualified news is not labeled a sourced report");
check(!isReportedMlbHeadline("Yankees improve source data for scouts"),
  "MLB source word in headline is not a report qualifier");

check(mlbSource.includes('mlbOfficialTeamUrl(club) + "/feeds/news/rss.xml"'),"MLB official club RSS");
check(mlbSource.includes("items.sort((a, b)"),"MLB RSS sorted by publication date");
check(!mlbSource.includes("if (items.length === 16) break;") &&
  mlbSource.indexOf("items.sort((a, b)") < mlbSource.indexOf("items.slice(0, 6)"),
  "MLB reads full RSS before selecting six newest headlines");
check(mlbSource.includes("https://www.mlb.com/"),"MLB only official source URLs");
check(mlbSource.includes("isSourcedReport: isReportedMlbHeadline(title)"),
  "MLB source qualifier is recorded before translating the original RSS title");

check(mlbSource.includes("return title;") && !mlbSource.includes('"Actualidad de " + clubName'),
  "MLB preserves real official headlines if translation is unavailable");
const lmbSource=read("lib/lmbClubContent.ts");
check(lmbSource.includes('">Noticias principales<"')&&lmbSource.includes('">Más Noticias<"'),"LMB reads both news sections");
check(lmbSource.includes("if (!news.length)")&&!lmbSource.includes("if (news.length < 3)"),"LMB retains one or two fresh official stories");
check(lmbSource.includes('stories: [], sourceStatus: "fallback"'),"LMB does not pass old archive as current news");
check(lmbSource.includes("const REVALIDATE_SECONDS = 900"),"LMB official content 15-minute cache");
const lmpSource=read("lib/lmpClubDirectoryData.ts");
const tagSection=lmpSource.split("const newsTag:")[1].split("};")[0];
const tagged=new Set([...tagSection.matchAll(/(\d+):\s*"[^"]+"/g)].map(x=>Number(x[1])));
for(const team of lmp)check(tagged.has(team.id),"LMP RSS tag for "+team.name);
check(tagged.has(5482),"LMP RSS tag for Algodoneros Guasave");
check(lmpSource.includes("stories.sort((a,b)=>b.published.localeCompare(a.published)"),"LMP articles sorted by official publication date");
check(lmpSource.includes("seen.has(story.url)"),"LMP RSS duplicate URL protection");
const guasave=read("lib/lmpAlgodonerosContent.ts");
const {isRepublishedAlgodonerosNews}=require("../lib/algodonerosNewsDedupe.ts");
const clubExample=[{title:"ALGODONEROS HACE ESTALLAR SU OFENSIVA PARA TRAERSE LA SERIE DE NAVOJOA",published:"2026-11-19T16:00:00Z"}];
check(isRepublishedAlgodonerosNews(clubExample,{
  title:"Algodoneros hace estallar su ofensiva para traerse la serie de Navojoa",
  published:"2026-11-20T11:00:00Z"
}),"Guasave removes a real club/LMP republication with one-day date difference");
check(!isRepublishedAlgodonerosNews(clubExample,{
  title:"Algodoneros y Venados cancelan su serie",
  published:"2026-11-21T11:00:00Z"
}),"Guasave preserves distinct official LMP articles");
check(!isRepublishedAlgodonerosNews(clubExample,{
  title:"Algodoneros hace estallar su ofensiva para traerse la serie de Navojoa",
  published:"2026-12-21T11:00:00Z"
}),"Guasave does not combine identical headlines posted a month apart");

check(guasave.includes("getLmpDirectoryNews(5482)")&&guasave.includes("teamNews, ...leagueNews")&&guasave.includes("isRepublishedAlgodonerosNews(teamNews, story)"),"Guasave merges sources while removing republications");
check(guasave.includes("sort((a,b)=>Date.parse(b.published)-Date.parse(a.published))"),"Guasave merged news sorted");
const report=read("lib/lmbReportsInReview.ts");
check(report.includes("validThrough")&&report.includes("officialTitles.some"),"Reports expire and disappear after official team publication");
// Comportamientos editoriales: probar el resultado, no solo buscar cadenas.
const {lmbReportsInReview}=require("../lib/lmbReportsInReview.ts");
const onDate=new Date("2026-11-23T12:00:00Z");
const reportsFor=(titles,date=onDate)=>lmbReportsInReview("leones",titles,date);
check(reportsFor([]).length===1,"LMB report shown until verification");
check(reportsFor(["Yadier Molina visita a los Leones"]).length===1,"Mere mention does not confirm appointment");
check(reportsFor(["¿Yadier Molina será el nuevo mánager de Leones?"]).length===1,"Question does not confirm appointment");
check(reportsFor(["Rumor: Yadier Molina podría ser mánager"]).length===1,"Speculation does not confirm appointment");
check(reportsFor(["Leones confirma a Yadier Molina como su nuevo mánager"]).length===0,"Official affirmative appointment hides report");
check(reportsFor(["Yadier Molina es nombrado director técnico de Leones"]).length===0,"Official named manager hides report");
check(reportsFor([],new Date("2026-12-06T12:00:00Z")).length===0,"Expired report is not presented as current");
check(lmbReportsInReview("diablos-rojos",[],onDate).length===0,"Report never leaks to another LMB team");
const mlbPage=read("app/equipos/mlb/[id]/page.tsx");
check(mlbPage.includes("REPORTE PERIODÍSTICO · MLB.COM")&&
  mlbPage.includes("REPORTE · MLB.COM")&&
  mlbPage.includes("no implica confirmación oficial del club."),
  "MLB featured and secondary news distinguish source reports from club announcements");
check(!mlbPage.includes("NOTICIA OFICIAL · FUENTE MLB"),
  "MLB news does not call press articles confirmed club news");
check(mlbPage.includes("const secondaryNews = news?.items.slice(1, 4) ?? [];") &&
  !mlbPage.includes("news.items.length > 1 ? news.items.slice(1, 4) : news.items"),
  "MLB never repeats a single featured RSS story in its secondary cards");
check(mlbPage.includes("{secondaryNews.length ? <div className=\"clubNewsGrid\">") &&
  mlbPage.includes("solo hay una noticia disponible; ya aparece como destacada arriba"),
  "MLB does not render empty secondary cards when only the featured story exists");


check(mlbPage.includes("Fecha no indicada")&&mlbPage.includes("news.items[0].date")&&
  mlbPage.includes("MLB no indicó fecha verificable."),"MLB does not imply undated news is dated");
const guasavePage=read("app/equipos/lmp/algodoneros/page.tsx");
check(guasavePage.includes('url.startsWith("https://editor.lmp.mx/")')&&
  guasavePage.includes("newsSource(topNews.url)")&&guasavePage.includes("newsSource(story.url)"),
  "Guasave identifies club versus league source in featured and secondary news");
for(const p of ["app/equipos/lmb/[slug]/page.tsx","app/equipos/lmb/algodoneros/page.tsx","app/equipos/lmp/[slug]/page.tsx"]){
 const page=read(p);check(/export const revalidate\s*=\s*900/.test(page),p+" 15-minute SSR cache");
}
check(read("app/equipos/lmb/[slug]/page.tsx").includes("EN SEGUIMIENTO · SIN CONFIRMACIÓN OFICIAL"),"Press rumor visually separated from official story");
console.log("Noticias MLB/LMB/LMP: "+checks+" regression checks OK.");
