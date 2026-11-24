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

const {findVerifiedMlbSigning,findVerifiedMlbWaiverClaim,findVerifiedMlbTrade,officialMlbTradeSide}=require("../lib/mlbNewsMovements.ts");
const recordTrade={
  typeCode:"TE",
  fromTeam:{id:142,name:"Minnesota Twins"},
  toTeam:{id:119,name:"Los Angeles Dodgers"}
};
const fallbackClubs=[
  {id:112,name:"Chicago Cubs"},
  {id:120,name:"Washington Nationals"},
  {id:119,name:"Los Angeles Dodgers"},
  {id:142,name:"Minnesota Twins"}
];
const rawRoxby={
  typeCode:"TE",
  description:"Washington Nationals traded RHP Braxton Roxby to Chicago Cubs for cash."
};
const fallback=(record,clubId,player)=>officialMlbTradeSide(record,clubId,player,fallbackClubs);
check(fallback(rawRoxby,112,"Braxton Roxby")?.direction==="received",
  "Cubs receives Roxby when official TE omits fromTeam/toTeam but description identifies both clubs");
check(fallback(rawRoxby,120,"Braxton Roxby")?.direction==="sent",
  "Nationals sends Roxby when the same official transaction names the sender");
check(fallback(rawRoxby,142,"Braxton Roxby")===null,
  "A third club cannot inherit a clear text-only trade");
check(fallback(rawRoxby,112,"Joey Bart")===null,
  "One multi-player article must not attribute Roxby's trade to claimed player Bart");
check(fallback({...rawRoxby,description:"Nationals traded Roxby to Cubs."},112,"Braxton Roxby")===null,
  "Fallback rejects abbreviated team/player descriptions");
check(fallback({...rawRoxby,typeCode:"TR"},112,"Braxton Roxby")?.direction==="received",
  "A different StatsAPI code can be accepted only with an unambiguous source trade description");
check(fallback({...rawRoxby,typeCode:"TR",description:"Washington Nationals transferred RHP Braxton Roxby to Chicago Cubs for cash."},112,"Braxton Roxby")===null,
  "A transfer sentence is never mistaken for an MLB trade");
check(fallback({...rawRoxby,typeCode:"TR",description:"RHP Braxton Roxby arrived in Chicago Cubs."},112,"Braxton Roxby")===null,
  "Unstructured text without explicit source and recipient remains unconfirmed");
check(fallback({...rawRoxby,fromTeam:{id:119,name:"Los Angeles Dodgers"}},112,"Braxton Roxby")===null,
  "Fallback rejects partial structured origin contradicting source description");
const rawLewis={
  typeCode:"TE",
  description:"Minnesota Twins traded 3B Royce Lewis to Los Angeles Dodgers for RHP Bobby Miller and C Francisco Espinoza."
};
check(fallback(rawLewis,119,"Royce Lewis")?.direction==="received",
  "Structured-free Twins-to-Dodgers trade identifies Lewis as received");
check(fallback(rawLewis,142,"Royce Lewis")?.direction==="sent",
  "Structured-free Twins-to-Dodgers trade identifies Lewis as sent");
check(fallback(rawLewis,119,"Bobby Miller")===null,
  "Text-only direction parser refuses a trade counterpart listed only after 'for'");
check(officialMlbTradeSide(recordTrade,119)?.direction==="received"&&
  officialMlbTradeSide(recordTrade,119)?.counterpart==="Minnesota Twins",
  "MLB structured team IDs classify Dodgers receiving Royce Lewis");
check(officialMlbTradeSide(recordTrade,142)?.direction==="sent"&&
  officialMlbTradeSide(recordTrade,142)?.counterpart==="Los Angeles Dodgers",
  "MLB structured team IDs classify Twins sending Royce Lewis");
check(officialMlbTradeSide(recordTrade,112)===null,
  "Neither participant: a different club may not confirm the trade");
check(officialMlbTradeSide({...recordTrade,typeCode:"TR"},119)===null,
  "MLB transfer code TR must never be mistaken for trade TE");
check(officialMlbTradeSide({...recordTrade,fromTeam:null},119)===null,
  "Missing origin team cannot infer trade direction");
check(officialMlbTradeSide({...recordTrade,toTeam:{id:142,name:"Minnesota Twins"}},142)===null,
  "Transaction with identical origin and destination cannot imply a trade");
const lewisArticle={
  url:"https://www.mlb.com/news/royce-lewis-traded-from-twins-to-dodgers",
  originalTitle:"Twins deal '17 top pick Lewis to Dodgers for pitcher, catching prospect",
  date:"2026-11-21T12:00:00Z"
};
const lewisIncoming={
  player:"Royce Lewis",date:"2026-11-20",isConfirmedSigning:false,
  tradeDirection:"received",tradeCounterpart:"Minnesota Twins"
};
const lewisOutgoing={
  ...lewisIncoming,tradeDirection:"sent",tradeCounterpart:"Los Angeles Dodgers"
};
check(findVerifiedMlbTrade(lewisArticle,[lewisIncoming])?.direction==="received",
  "Official Lewis news marks Dodgers incoming trade only");
check(findVerifiedMlbTrade(lewisArticle,[lewisOutgoing])?.direction==="sent",
  "Same Lewis article can mark Twins outgoing trade when source club is sender");
check(findVerifiedMlbTrade({...lewisArticle,originalTitle:"Could Twins trade Lewis to Dodgers?"},[lewisIncoming])===null,
  "Speculation about a possible trade is never certified retroactively");
check(findVerifiedMlbTrade({...lewisArticle,originalTitle:"Twins evaluate Lewis' new Dodgers role"},[lewisIncoming])===null,
  "Generic analysis articles do not get confirmation without trade language");
check(findVerifiedMlbTrade({...lewisArticle,date:null},[lewisIncoming])===null,
  "Undated MLB trade articles are not automatically matched");
check(findVerifiedMlbTrade({...lewisArticle,date:"2026-10-10T12:00:00Z"},[lewisIncoming])===null,
  "Trade articles older than the maximum seven days are not matched");
check(findVerifiedMlbTrade({...lewisArticle,url:"https://example.com/news/royce-lewis-traded-to-dodgers"},[lewisIncoming])===null,
  "Trade article must be from MLB.com, not a similarly named website");
check(findVerifiedMlbTrade({...lewisArticle,url:"https://www.mlb.com/news/lewis-traded-to-dodgers"},[lewisIncoming])===null,
  "Trade article slug must contain player's full name");
check(findVerifiedMlbTrade({...lewisArticle,originalTitle:"Twins trade Ortiz to Dodgers"},[lewisIncoming])===null,
  "Trade article headline must refer to the actual player's surname");
check(findVerifiedMlbTrade(lewisArticle,[{...lewisIncoming,player:"Royce O'Lewis"}])===null,
  "Another player with a similar surname is never accepted");
check(findVerifiedMlbTrade(lewisArticle,[{...lewisIncoming,tradeDirection:null}])===null,
  "A movement with no trusted origin/destination does not certify a trade");
check(findVerifiedMlbTrade(lewisArticle,[lewisIncoming,lewisIncoming])===null,
  "Duplicate candidate official trades are treated as ambiguous");
const roxbyArticle={
  url:"https://www.mlb.com/cubs/news/joey-bart-deal-with-cubs",
  originalTitle:"Cubs add C Bart off waivers, trade for RHP Roxby in flurry of moves",
  date:"2026-11-21T10:00:00Z"
};
const roxbyIncoming={
  player:"Braxton Roxby",date:"2026-11-20",tradeDirection:"received",
  tradeCounterpart:"Washington Nationals",isConfirmedSigning:false
};
check(findVerifiedMlbTrade(roxbyArticle,[roxbyIncoming])===null,
  "Multiple-player Cubs article does not certify Roxby when full name is absent from URL");
check(mlbSource.includes("officialMlbTradeSide({...row, description: desc}, club.id, player, MLB_CLUBS)") &&
  mlbSource.includes("tradeDirection: trade?.direction ?? null") &&
  mlbSource.includes("tradeCounterpart: trade?.counterpart ?? null"),
  "Team trade directions come exclusively from structured MLB transaction fields");
const suterNews={
  url:"https://www.mlb.com/yankees/news/brent-suter-yankees-contract",
  originalTitle:"Yankees reach 1-year deal with lefty reliever Suter (source)",
  date:"2026-11-24T08:00:00Z"
};
const suterOfficial={player:"Brent Suter",date:"2026-11-24",isConfirmedSigning:true};
const hillNews={
  url:"https://www.mlb.com/yankees/news/tim-hill-deal-with-yankees",
  originalTitle:"Hill agrees to 1-year deal to return to Yankees (source)",
  date:"2026-11-15T18:00:00Z"
};
const bartNews={
  url:"https://www.mlb.com/cubs/news/joey-bart-deal-with-cubs",
  originalTitle:"Cubs add C Bart off waivers, trade for RHP Roxby in flurry of moves",
  date:"2026-11-21T10:00:00Z"
};
const bartOfficial={player:"Joey Bart",date:"2026-11-20",isConfirmedSigning:false,isConfirmedWaiverClaim:true};
check(findVerifiedMlbWaiverClaim(bartNews,[bartOfficial])?.player==="Joey Bart",
  "Cubs Joey Bart article links to his MLB waiver claim on Nov 20");
check(findVerifiedMlbWaiverClaim(bartNews,[{...bartOfficial,isConfirmedWaiverClaim:false}])===null,
  "Cubs does not infer a waiver claim from the news alone");
check(findVerifiedMlbWaiverClaim(bartNews,[{...bartOfficial,player:"Braxton Roxby"}])===null,
  "Cubs multi-player article never certifies unrelated Roxby as waiver addition");
check(findVerifiedMlbWaiverClaim({...bartNews,originalTitle:"Could Cubs add Bart off waivers?"},[bartOfficial])===null,
  "Speculative waiver headline cannot be marked as recorded movement");
check(findVerifiedMlbWaiverClaim({...bartNews,date:"2026-11-01T12:00:00Z"},[bartOfficial])===null,
  "Waiver articles older than five days cannot be connected");
check(findVerifiedMlbWaiverClaim({...bartNews,url:"https://www.mlb.com/cubs/news/bart-roxby-moves"},[bartOfficial])===null,
  "Waiver link needs full official player name in article slug");
check(findVerifiedMlbSigning(bartNews,[{...bartOfficial,isConfirmedSigning:true}])===null,
  "Cubs Bart waiver report is not mislabeled a free agent signing");
check(mlbSource.includes('desc.toLowerCase().startsWith(club.name.toLowerCase() + " claimed ")')&&
  mlbSource.includes('/\\boff waivers\\b/i.test(desc)'),
  "Waiver record must identify the receiving MLB club and explicit off-waivers operation");
check(findVerifiedMlbSigning(suterNews,[suterOfficial])?.player==="Brent Suter",
  "Suter sourced report connects to same-player MLB signing on Nov 24");
check(findVerifiedMlbSigning({...suterNews,originalTitle:"Could Yankees sign Brent Suter?"},[suterOfficial])===null,
  "Question about a future signing is not retroactively certified");
check(findVerifiedMlbSigning({...suterNews,originalTitle:"Yankees might sign Brent Suter"},[suterOfficial])===null,
  "Speculative MLB signing language is not treated as a signed report");
check(findVerifiedMlbSigning({...suterNews,originalTitle:"Brent Suter returns to New York"},[suterOfficial])===null,
  "Ambiguous return headline does not prove a new signing");

check(findVerifiedMlbSigning(hillNews,[{player:"Tim Hill",date:"2026-11-24",isConfirmedSigning:true}])?.player==="Tim Hill",
  "Hill original report connects to same-player MLB signing nine days later");
check(findVerifiedMlbSigning(suterNews,[{...suterOfficial,isConfirmedSigning:false}])===null,
  "Unverified transactions or unrelated transaction types do not confirm a signing");
check(findVerifiedMlbSigning(suterNews,[{...suterOfficial,player:"Brent Headrick"}])===null,
  "Similar player name is not an official match");
check(findVerifiedMlbSigning({...suterNews,originalTitle:"Yankees discuss bullpen options including Suter"},[suterOfficial])===null,
  "A discussion article does not inherit confirmation from a signed player");
check(findVerifiedMlbSigning({...suterNews,url:"https://example.com/yankees/news/brent-suter-contract"},[suterOfficial])===null,
  "Non MLB.com articles are never certified by the MLB club merger");
check(findVerifiedMlbSigning({...suterNews,date:null},[suterOfficial])===null,
  "Undated articles do not acquire signing confirmations");
check(findVerifiedMlbSigning({...suterNews,date:"2026-10-01T08:00:00Z"},[suterOfficial])===null,
  "Old reports do not link to unrelated future signing cycles");
check(findVerifiedMlbSigning(suterNews,[suterOfficial,suterOfficial])===null,
  "Ambiguous multiple official transactions are not assigned speculatively");
check(findVerifiedMlbSigning({...suterNews,url:"https://www.mlb.com/yankees/news/suter-joins-team"},
  [suterOfficial])===null,
  "A surname alone in the link cannot validate a person");
check(findVerifiedMlbSigning({...suterNews,originalTitle:"Yankees sign pitcher Jones"},
  [suterOfficial])===null,
  "A different player in the headline is never associated by URL alone");
check(mlbSource.includes("originalTitle: title")&&
  mlbSource.includes("isConfirmedSigning: Boolean(player?.trim())"),
  "MLB RSS keeps the original headline and StatsAPI marks explicit signatures only");


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
const onDate=new Date("2026-11-21T12:00:00Z");
const reportsFor=(titles,date=onDate)=>lmbReportsInReview("leones",titles,date);
check(reportsFor([]).length===1,"LMB report shown until verification");
check(reportsFor(["Yadier Molina visita a los Leones"]).length===1,"Mere mention does not confirm appointment");
check(reportsFor(["¿Yadier Molina será el nuevo mánager de Leones?"]).length===1,"Question does not confirm appointment");
check(reportsFor(["Rumor: Yadier Molina podría ser mánager"]).length===1,"Speculation does not confirm appointment");
check(reportsFor(["Leones confirma a Yadier Molina como su nuevo mánager"]).length===0,"Official affirmative appointment hides report");
check(reportsFor(["Yadier Molina es nombrado director técnico de Leones"]).length===0,"Official named manager hides report");
check(reportsFor([],new Date("2026-11-22T12:00:00Z")).length===1,
  "Leones sourced report remains marked unconfirmed before club announcement");
check(reportsFor([],new Date("2026-11-23T12:00:00Z")).length===0,
  "Leones report stays closed from official Yadier Molina announcement even without official feed");
check(reportsFor([],new Date("2026-12-06T12:00:00Z")).length===0,"Expired report is not presented as current");
check(lmbReportsInReview("diablos-rojos",[],onDate).length===0,"Report never leaks to another LMB team");
const mlbPage=read("app/equipos/mlb/[id]/page.tsx");
check(mlbPage.includes('(view === "movimientos" || view === "resumen") ? getMlbClubTransactions(club)') &&
  mlbPage.includes("findVerifiedMlbSigning(news.items[0], transactions.items)") &&
  mlbPage.includes("findVerifiedMlbSigning(story, transactions.items)"),
  "News reconciliation uses official StatsAPI in summary featured and secondary cards");
check(mlbPage.includes("findVerifiedMlbTrade(news.items[0], transactions.items)") &&
  mlbPage.includes("findVerifiedMlbTrade(story, transactions.items)") &&
  mlbPage.includes("INTERCAMBIO REGISTRADO · MLB") &&
  mlbPage.includes('featuredTrade.direction === "received" ? "RECIBIDO" : "CEDIDO"') &&
  mlbPage.includes('trade.direction === "received" ? "RECIBIDO" : "CEDIDO"'),
  "All MLB club cards label trades by verified received/sent direction");
check(mlbPage.includes('item.tradeDirection === "received" ? "RECIBIDO EN INTERCAMBIO" : "CEDIDO EN INTERCAMBIO"') &&
  mlbPage.includes('name={item.tradeCounterpart}') &&
  mlbPage.includes('<strong>{item.tradeCounterpart}</strong>') &&
  mlbPage.includes("item.tradeDirection ? <div"),
  "MLB Movimientos uses StatsAPI from/to direction and counterpart instead of inferring it from translated prose");

check(mlbPage.includes("RECLAMO DE WAIVERS REGISTRADO · MLB") &&
  mlbPage.includes("INCORPORACIÓN POR WAIVERS · MLB") &&
  mlbPage.includes("findVerifiedMlbWaiverClaim(story, transactions.items)") &&
  mlbPage.includes("findVerifiedMlbWaiverClaim(news.items[0], transactions.items)"),
  "Waiver labels appear only when StatsAPI corroborates featured or secondary MLB news");
check(mlbPage.includes("MOVIMIENTO REGISTRADO · MLB") &&
  mlbPage.includes("CONTRATACIÓN REGISTRADA · MLB") &&
  mlbPage.includes("El registro verifica el movimiento, no necesariamente las condiciones"),
  "MLB news clearly limits proof to the official transaction, not the article's deal terms");

check(mlbPage.includes("REPORTE PERIODÍSTICO · MLB.COM")&&
  mlbPage.includes("REPORTE · MLB.COM")&&
  mlbPage.includes("no implica confirmación oficial del club."),
  "MLB featured and secondary news distinguish source reports from club announcements");
check(!mlbPage.includes("NOTICIA OFICIAL · FUENTE MLB"),
  "MLB news does not call press articles confirmed club news");
check(mlbPage.includes('format(new Date(iso)) + " (RSS)"') &&
  mlbPage.includes("Las fechas corresponden al canal RSS y pueden diferir de las del artículo."),
  "MLB news timestamps are explicitly attributed to the RSS rather than to the editorial article");
check(mlbPage.includes("Noticias y reportes de MLB.com, plantilla, movimientos") &&
  !mlbPage.includes("Noticias oficiales, plantilla, movimientos"),
  "MLB metadata does not imply every newsroom story is a confirmed club announcement");

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
