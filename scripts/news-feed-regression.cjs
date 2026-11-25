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

const {findVerifiedMlbSigning,findVerifiedMlbWaiverClaim,findVerifiedMlbTrade,officialMlbTradeSide,isConfirmedMlbRelease,findVerifiedMlbRelease}=require("../lib/mlbNewsMovements.ts");
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
// Casos reales de registro MLB: los titulares/URLs de prueba son sintéticos
// para no inventar que MLB haya publicado artículos dedicados a cada baja.
const raysCut="Tampa Bay Rays released RHP Jesse Scholtens.";
const oriolesCut="Baltimore Orioles released RF Rece Hinds.";
check(isConfirmedMlbRelease(raysCut,"Tampa Bay Rays","Jesse Scholtens"),
  "Rays explicitly released Jesse Scholtens on Nov 19");
check(isConfirmedMlbRelease(oriolesCut,"Baltimore Orioles","Rece Hinds"),
  "Orioles explicitly released Rece Hinds on Nov 17");
check(!isConfirmedMlbRelease(raysCut,"Baltimore Orioles","Jesse Scholtens"),
  "Release cannot be assigned to a different team");
check(!isConfirmedMlbRelease(raysCut,"Tampa Bay Rays","Jesse Bolton"),
  "A near-name may never inherit someone else's release");
check(!isConfirmedMlbRelease("Toronto Blue Jays designated RHP Chase Lee for assignment.",
  "Toronto Blue Jays","Chase Lee"),"DFA is not a final release");
check(!isConfirmedMlbRelease("Detroit Tigers placed RHP Sawyer Gipson-Long on unconditional release waivers.",
  "Detroit Tigers","Sawyer Gipson-Long"),"Release waivers alone are not final release");
check(!isConfirmedMlbRelease("Detroit Tigers signed free agent RHP Sawyer Gipson-Long to a minor league contract.",
  "Detroit Tigers","Sawyer Gipson-Long"),"Later minor league signing is not a release");
check(!isConfirmedMlbRelease("Baltimore Orioles outrighted C Zach Morgan to Triple-A Norfolk.",
  "Baltimore Orioles","Zach Morgan"),"Outright is not a release");
check(!isConfirmedMlbRelease("Baltimore Orioles non-tendered RF Rece Hinds.",
  "Baltimore Orioles","Rece Hinds"),"Non-tender is not automatically a recorded release");
check(!isConfirmedMlbRelease("Baltimore Orioles released RF Rece Hinds and C Zach Morgan.",
  "Baltimore Orioles","Rece Hinds"),"Multi-player release text is ambiguous");
const hypotheticalRelease={
  url:"https://www.mlb.com/rays/news/jesse-scholtens-released",
  originalTitle:"Rays release Jesse Scholtens",
  date:"2026-11-19T15:00:00Z",
};
const officialScholtens={
  player:"Jesse Scholtens",date:"2026-11-19",isConfirmedSigning:false,
  isConfirmedRelease:true
};
check(findVerifiedMlbRelease(hypotheticalRelease,[officialScholtens])?.player==="Jesse Scholtens",
  "A hypothetical direct MLB release headline matches an official Rays transaction");
check(findVerifiedMlbRelease({...hypotheticalRelease,originalTitle:"Rays may release Jesse Scholtens"},
  [officialScholtens])===null,"Possible future release cannot gain confirmed status");
check(findVerifiedMlbRelease({...hypotheticalRelease,originalTitle:"Could Rays release Jesse Scholtens?"},
  [officialScholtens])===null,"Interrogative release headline is not retrospectively certified");
check(findVerifiedMlbRelease({...hypotheticalRelease,originalTitle:"Rays place Jesse Scholtens on release waivers"},
  [officialScholtens])===null,"Release-waivers headline is not definitive liberation");
check(findVerifiedMlbRelease({...hypotheticalRelease,originalTitle:"Rays designate Jesse Scholtens for assignment (DFA)"},
  [officialScholtens])===null,"DFA article never receives a release badge");
check(findVerifiedMlbRelease({...hypotheticalRelease,originalTitle:"Rays release Joe Smith"},
  [officialScholtens])===null,"Different player in headline cannot receive badge");
check(findVerifiedMlbRelease({...hypotheticalRelease,url:"https://www.mlb.com/rays/news/scholtens-released"},
  [officialScholtens])===null,"Release headline URL must contain full player name");
check(findVerifiedMlbRelease({...hypotheticalRelease,url:"https://example.com/rays/news/jesse-scholtens-released"},
  [officialScholtens])===null,"Outside domain is not verified as an MLB.com article");
check(findVerifiedMlbRelease({...hypotheticalRelease,date:null},
  [officialScholtens])===null,"Undated release news cannot be automatically matched");
check(findVerifiedMlbRelease({...hypotheticalRelease,date:"2026-11-01T15:00:00Z"},
  [officialScholtens])===null,"News outside the seven-day window does not link to an old release");
check(findVerifiedMlbRelease(hypotheticalRelease,[{...officialScholtens,isConfirmedRelease:false}])===null,
  "A generic low-confidence movement cannot confirm a release");
check(findVerifiedMlbRelease(hypotheticalRelease,[officialScholtens,officialScholtens])===null,
  "Duplicate candidate releases must be treated as ambiguous");
check(mlbSource.includes("isConfirmedRelease: isConfirmedMlbRelease(desc, club.name, player)"),
  "Only the team's original StatsAPI description can certify the release");

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

// Detector de candidatos: el pipeline NO publica automáticamente registros.
const {detectStaffAnnouncement,dedupeStaffCandidates}=require("../lib/staffAnnouncementDetection.ts");
const staffCandidate=(title,league="LMB",clubSlug="leones",url)=>detectStaffAnnouncement({
  title,league,clubSlug,url:url??(
    league==="LMB"
      ?"https://lmb.com.mx/noticias/yadier-molina-nuevo-manager-de-los-leones"
      :"https://editor.lmp.mx/nuevo-manager-de-jaguares/"
  ),
  publishedAt:"2026-11-23T18:00:00Z",
});
check(staffCandidate("El histórico ex receptor Yadier Molina es el nuevo manager de los Leones de Yucatán")?.proposedKind==="appointment",
  "Official Yadier Molina headline enters candidate review, not automatically published");
check(staffCandidate("Benjamín Gil llega al infierno: es el nuevo manager de los Diablos Rojos",
 "LMB","diablos-rojos","https://lmb.com.mx/noticias/benjamin-gil-llega-al-infierno-es-el-nuevo-manager-de-los-diablos-rojos")?.proposedKind==="appointment",
  "Verified LMB manager appointment headline qualifies for review");
check(staffCandidate("Ratifican a Roberto Chapo Vizcarra como manager de Águilas",
 "LMP","aguilas","https://editor.lmp.mx/chapo-vizcarra-es-ratificado-como-manager-de-aguilas-de-mexicali/")?.proposedKind==="ratification",
  "Confirmed club ratification differs from new managerial appointment");
check(staffCandidate("Jaguares nombran a Erik Rodríguez como manager en sustitución de Luis Carlos Rivera",
 "LMP","jaguares")?.proposedKind==="replacement",
  "Manager replacement is a candidate event, not proof of dismissal");
check(staffCandidate("Definido el cuerpo técnico de Naranjeros",
 "LMP","naranjeros")?.proposedKind==="staff-change",
  "Entire coaching staff headline is reviewed as a group rather than invented individual hires");
check(staffCandidate("Águilas de Mexicali presenta su staff de coaches",
 "LMP","aguilas")?.proposedKind==="staff-change",
  "Staff presentation is flagged for review without inventing individuals");
check(staffCandidate('Rafael "Rafy" Chaves regresa a los planes de los Leones como coach de pitcheo para el 2027',
 "LMB","leones",
 "https://lmb.com.mx/noticias/rafael-rafy-chaves-regresa-los-planes-de-los-leones-como-coach-de-pitcheo-para-el-2027")?.status==="pending_review",
 "Official coach return is discovered but stays pending until individual review");
check(staffCandidate("Lorenzo Bundy abre nueva etapa dentro de los Diablos Rojos como Asesor Deportivo",
 "LMB","diablos-rojos")?.proposedKind==="coach-addition",
  "Source detector notices baseball staff changes beyond manager");
check(staffCandidate("Leones confirman que su manager renuncia")?.proposedKind==="resignation",
  "Resignation is not mislabeled as replacement or firing");
check(staffCandidate("Leones destituye a su manager")?.proposedKind==="dismissal",
  "Dismissal is distinguished from resignation");
check(staffCandidate("Leones designa manager interino")?.proposedKind==="interim",
  "Interim designation is not labeled permanent appointment");
for(const title of [
  "Sergio Omar Gastélum se perfila para repetir con Pericos como manager",
  "¿Yadier Molina será el nuevo manager de Leones?",
  "Rumores: Yadier Molina podría ser manager en Yucatán",
  "Leones desmiente que Yadier Molina será su nuevo manager",
  "Héctor Hurtado es el nuevo manager de Diablos Rojos Femenil",
  "Manager de Leonas de Yucatán se integra a LMS",
  "Yadier Molina visita a Leones y habla de la nueva temporada con el manager",
  "Lo que dijo el manager sobre la jornada del sábado"
])check(staffCandidate(title)===null,
  "Rumor, softbol, denial or generic manager mention cannot enter pending-confirmation feed: "+title);
check(staffCandidate("Leones anuncian a Yadier Molina como nuevo manager",
 "LMB","leones","https://evil.example/noticias/yadier-molina-nuevo-manager")===null,
 "Staff auditing ignores spoofed official website");
check(staffCandidate("Leones anuncian a Yadier Molina como nuevo manager",
 "LMB","leones","https://lmb.com.mx.evil.example/noticias/yadier-molina-nuevo-manager")===null,
 "Staff audit ignores lookalike LMB domain");
check(staffCandidate("Leones anuncian a Yadier Molina como nuevo manager",
 "LMB","leones","http://lmb.com.mx/noticias/yadier-molina-nuevo-manager")===null,
 "HTTP-only article cannot qualify as official");
check(staffCandidate("Leones anuncian a Yadier Molina como nuevo manager",
 "LMB","leones","https://lmb.com.mx/noticias/yadier-molina-nuevo-manager?ref=ad")===null,
 "Uncanonical official article URL with query parameters does not qualify");
const verifiedMolina=detectStaffAnnouncement({
  league:"LMB",clubSlug:"leones",
  title:"El histórico ex receptor Yadier Molina es el nuevo manager de los Leones de Yucatán",
  url:"https://lmb.com.mx/noticias/el-historico-ex-receptor-yadier-molina-es-el-nuevo-manager-de-los-leones-de-yucatan"
},["https://lmb.com.mx/noticias/el-historico-ex-receptor-yadier-molina-es-el-nuevo-manager-de-los-leones-de-yucatan"]);
check(verifiedMolina?.status==="already_verified"&&verifiedMolina.publishedAt===null,
 "Exact URL marks the existing editorial record and never invents an LMB publication date");
const fresh=staffCandidate("Leones anuncian a Yadier Molina como nuevo manager");
check(fresh?.status==="pending_review" &&
  fresh.validationNote.includes("NO publicar como confirmado"),
  "Official-looking unreviewed article always remains pending review");
check(dedupeStaffCandidates([fresh,fresh]).length===1,
 "Candidate same league-club-URL is deduplicated");
check(read("lib/lmpClubDirectoryData.ts").includes("LMP_OFFICIAL_NEWS_TAGS[id]") &&
  read("lib/lmpOfficialNewsTags.ts").includes("5482"),
 "LMP auditor shares exact official team RSS feed mapping with production app");
const auditSrc=read("scripts/staff-announcement-audit.cjs");
const auditWorkflow=read(".github/workflows/staff-announcement-audit.yml");
check(auditSrc.includes("LMB_CLUB_DIRECTORY") &&
  auditSrc.includes("LMP_CLUB_DIRECTORY") &&
  auditSrc.includes("STALE_DAYS=120") &&
  auditSrc.includes('status==="pending_review"') &&
  auditSrc.includes("Ningún candidato queda confirmado") &&
  auditSrc.includes("failures.length>=10"),
 "Auditor scans all Mexican league club sources and preserves failure status and editorial safeguards");
check(auditWorkflow.includes("workflow_dispatch:") &&
  auditWorkflow.includes('cron: "17 12 * * *"') &&
  auditWorkflow.includes("permissions:\n  contents: read") &&
  auditWorkflow.includes("if: always()") &&
  auditWorkflow.includes("actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02") &&
  !auditWorkflow.includes("contents: write"),
 "Daily GitHub Action reports candidates read-only, retains artifact even on source failure");

const {previewLmbMovements,previewLmpMovements}=require("../lib/officialMovementPreview.ts");
const lmbMovementsExample=[
  {date:"2026-11-19",title:"Derechos recibidos: Andretty Cordero Medina",
   description:"El club Acereros de Monclova cede de manera definitiva los derechos de Andretty Cordero Medina al club Leones de Yucatán.",
   url:"https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-19-de-noviembre-de-2026",automatic:true},
  {date:"2026-11-19",title:"Derechos cedidos: Jared Cole Wetherbee",
   description:"El club Leones de Yucatán cede de manera definitiva los derechos de Jared Cole Wetherbee al club Acereros de Monclova.",
   url:"https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-19-de-noviembre-de-2026",automatic:true}
];
check(previewLmbMovements(lmbMovementsExample).length===2,
  "LMB preview preserves distinct movements within same official daily bulletin");
check(previewLmbMovements([...lmbMovementsExample,lmbMovementsExample[0]]).length===2,
  "LMB preview deduplicates the same official movement");
check(previewLmbMovements([{...lmbMovementsExample[0],automatic:false}]).length===0,
  "Archived LMB items never masquerade as newly connected bulletins");
check(previewLmbMovements([{...lmbMovementsExample[0],url:"https://example.com/fake"}]).length===0,
  "LMB movement previews accept only official lmb.com.mx daily reserve bulletins");
check(previewLmbMovements([{...lmbMovementsExample[0],date:"2026-02-30"}]).length===0,
  "LMB movement previews reject nonexistent dates");
check(previewLmbMovements(lmbMovementsExample,1).length===1,
  "LMB preview respects limited card count");
// LMB: nombramiento oficial de cuerpo técnico por comunicado propio,
// no movimiento de lista de reserva ni transacción de jugador.
const {officialLmbPersonnelAppointments}=require("../lib/lmbOfficialPersonnel.ts");
const leonesAppointments=officialLmbPersonnelAppointments("https://lmb.com.mx/equipos/leones");
check(leonesAppointments.length===1 &&
  leonesAppointments[0].person==="Yadier Molina" &&
  leonesAppointments[0].date==="2026-11-23" &&
  leonesAppointments[0].role==="Mánager" &&
  leonesAppointments[0].effectiveSeason==="2027",
  "Yadier Molina is an official Nov 23 Leones managerial appointment for 2027");
check(leonesAppointments[0].url===
  "https://lmb.com.mx/noticias/el-historico-ex-receptor-yadier-molina-es-el-nuevo-manager-de-los-leones-de-yucatan",
  "Leones manager appointment cites the verified official LMB announcement");
check(officialLmbPersonnelAppointments("https://lmb.com.mx/equipos/acereros").length===0 &&
  officialLmbPersonnelAppointments("https://lmb.com.mx/equipos/diablos-rojos").some(e=>e.person==="Benjamín Gil") &&
  officialLmbPersonnelAppointments("https://not-lmb.com.mx/equipos/leones").length===0,
  "Leones appointment never leaks to other LMB clubs or unofficial domains");
const molinaMovement={
 date:leonesAppointments[0].date,
 title:"Nombramiento oficial: "+leonesAppointments[0].person,
 description:leonesAppointments[0].description,
 url:leonesAppointments[0].url,
 automatic:false,
 sourceKind:"official-appointment"
};
const mixedLeonesPreview=previewLmbMovements([...lmbMovementsExample,molinaMovement],2);
check(mixedLeonesPreview.length===2 &&
  mixedLeonesPreview[0].kind==="official-appointment" &&
  mixedLeonesPreview[0].title.includes("Yadier Molina") &&
  mixedLeonesPreview[0].date==="2026-11-23",
  "Official manager announcement comes before older reserve moves in Leones summary");
check(previewLmbMovements([{...molinaMovement,sourceKind:undefined}]).length===0 &&
  previewLmbMovements([{...molinaMovement,automatic:true}]).length===0,
  "A normal archived entry or automatic reserve item cannot impersonate a staff announcement");
check(previewLmbMovements([{...molinaMovement,url:"https://example.com/anuncio-falso"}]).length===0,
  "Staff announcement requires an official LMB news URL");
check(previewLmbMovements([molinaMovement]).length===1,
  "An official managerial announcement remains visible even if no fresh reserve bulletin is available");
check(read("lib/lmbMovements.ts").includes("officialLmbPersonnelAppointments(config.profileUrl)") &&
  read("lib/lmbMovements.ts").includes('sourceKind: "official-appointment" as const'),
  "LMB movement timeline merges independently verified club appointments");
check(read("components/OfficialMovementPreviewSection.tsx").includes("staffEventLabel(item.staffKind") &&
  read("components/OfficialMovementPreviewSection.tsx").includes("Consultar anuncio oficial"),
  "LMB summary distinguishes managerial appointment from a transaction in reserve lists");

const {verifiedPersonnelEventsForClub,staffEventLabel}=require("../lib/verifiedPersonnelEvents.ts");
const {verifiedStaffNewsForClub}=require("../lib/verifiedStaffNewsCrosslink.ts");
const molinaArticle="https://lmb.com.mx/noticias/el-historico-ex-receptor-yadier-molina-es-el-nuevo-manager-de-los-leones-de-yucatan";
const jaguaresArticle="https://editor.lmp.mx/erik-rodriguez-nuevo-manager-de-jaguares/";
check(verifiedStaffNewsForClub("LMB","leones",molinaArticle)[0]?.person==="Yadier Molina",
  "Leones news official source links to the exact verified Yadier movement");
check(verifiedStaffNewsForClub("LMP","jaguares",jaguaresArticle)[0]?.person==="Erik Rodríguez",
  "LMP news links to verified Jaguares manager replacement");
check(verifiedStaffNewsForClub("LMB","leones",molinaArticle+"/").length===1,
  "Trailing slash variation of same official LMB article matches exactly");
check(verifiedStaffNewsForClub("LMB","acereros",molinaArticle).length===0,
  "An official LMB Leones appointment cannot become an Acereros movement");
check(verifiedStaffNewsForClub("LMP","jaguares",molinaArticle).length===0,
  "An LMB article cannot link to an LMP movement");
check(verifiedStaffNewsForClub("LMB","leones","https://lmb.com.mx/noticias/yadier-molina-rumores").length===0,
  "A different headline or speculation URL cannot borrow a verified staff badge");
check(verifiedStaffNewsForClub("LMB","leones",molinaArticle+"?utm_campaign=test").length===0,
  "Source URL with tracking query cannot be silently certified");
check(verifiedStaffNewsForClub("LMB","leones","https://lmb.com.mx.evil.example/noticias/yadier-molina").length===0,
  "Lookalike official domain cannot produce a verified link");
check(verifiedStaffNewsForClub("LMP","jaguares",jaguaresArticle.replace("https:","http:")).length===0,
  "Insecure copy of LMP URL cannot produce verified crosslink");
for(const page of [
  "app/equipos/lmb/[slug]/page.tsx",
  "app/equipos/lmb/algodoneros/page.tsx",
  "components/LmpDirectoryClubProfile.tsx",
  "app/equipos/lmp/algodoneros/page.tsx",
]){
  const source=read(page);
  check(source.includes("verifiedStaffNewsForClub(") &&
    source.includes("CUERPO TÉCNICO · VER EVENTO DOCUMENTADO") &&
    source.includes("CUERPO TÉCNICO · EVENTO DOCUMENTADO") &&
    source.includes("vista=movimientos"),
    "All 30 Mexican team summaries link only verified staff articles to movement history: "+page);
}

const lmbStaffCases=[
  ["leones","Yadier Molina","2026-11-23"],
  ["diablos-rojos","Benjamín Gil","2026-10-15"],
  ["guerreros","Asdrúbal Cabrera","2026-10-20"],
  ["saraperos","Lloyd McClendon","2026-11-11"],
  ["dorados","Tony DeFrancesco","2026-09-03"]
];
for(const [club,person,date] of lmbStaffCases){
  const events=verifiedPersonnelEventsForClub("LMB",club);
  check(events.some(e=>e.person===person&&e.date===date&&e.kind==="appointment"),
    "LMB official manager appointment "+club+" documented with source");
}
check(verifiedPersonnelEventsForClub("LMB","diablos-rojos").length===1,
  "Two official articles introducing Benjamin Gil count as one appointment event");
check(verifiedPersonnelEventsForClub("LMB","leones").length===1 &&
  verifiedPersonnelEventsForClub("LMP","leones").length===0,
  "Manager event cannot cross leagues or be assigned to another club");
check(verifiedPersonnelEventsForClub("LMB","leonas").length===0,
  "Mexican Softball League managerial news must never become an LMB event");
check(verifiedPersonnelEventsForClub("LMB","pericos").length===0,
  "An equivocal se perfila headline cannot create an automatic managerial confirmation");

const jaguaresStaff=verifiedPersonnelEventsForClub("LMP","jaguares");
check(jaguaresStaff.length===1&&jaguaresStaff[0].person==="Erik Rodríguez"&&
  jaguaresStaff[0].date==="2026-11-05"&&jaguaresStaff[0].kind==="replacement"&&
  jaguaresStaff[0].replaces==="Luis Carlos Rivera",
  "Jaguares replacement records both managers but does not attribute a dismissal");
const lmpStaffCases=[
  ["yaquis","José Mosquera","2026-06-29","appointment"],
  ["mayos","Miguel Tejada","2026-05-21","appointment"],
  ["naranjeros","José “Cheo” Moreno","2026-05-08","appointment"],
  ["aguilas","Roberto “Chapo” Vizcarra","2026-03-02","ratification"],
  ["venados","Chris Roberson","2026-02-21","appointment"]
];
for(const [club,person,date,kind] of lmpStaffCases){
  check(verifiedPersonnelEventsForClub("LMP",club).some(e=>
    e.person===person&&e.date===date&&e.kind===kind),
    "LMP historical staff event "+club+" has verified kind/date");
}
check(staffEventLabel("appointment")==="Nombramiento oficial" &&
  staffEventLabel("ratification")==="Ratificación oficial" &&
  staffEventLabel("replacement")==="Cambio de mánager confirmado" &&
  staffEventLabel("resignation")!==staffEventLabel("dismissal"),
  "Staff schema distinguishes appointments, reappointments, replacements, resignations and dismissals");
const coachAdditions=[
  ["naranjeros","Gil Velázquez","Coach de banca","2026-07-23","https://editor.lmp.mx/definido-el-cuerpo-tecnico-de-naranjeros/"],
  ["aguilas","Adulfo Camacho","Coach de tercera base","2026-08-18","https://editor.lmp.mx/aguilas-de-mexicali-presenta-su-staff-de-coaches/"]
];
for(const [club,person,role,date,url] of coachAdditions){
  const event=verifiedPersonnelEventsForClub("LMP",club).find(e=>e.person===person);
  check(Boolean(event && event.kind==="coach-addition" && event.role===role &&
    event.date===date && event.url===url),
    "Verified LMP coaching addition is not confused with a manager or player: "+club);
}
check(staffEventLabel("coach-addition")==="Incorporación al cuerpo técnico" &&
  staffEventLabel("departure")!==staffEventLabel("dismissal"),
  "Coach appointments and staff departures preserve distinct editorial meanings");
check(verifiedPersonnelEventsForClub("LMP","aguilas").length===2 &&
  verifiedPersonnelEventsForClub("LMP","naranjeros").length===5,
  "Manager ratifications and coach additions coexist as independent dated events");
check(read("components/OfficialMovementPreviewSection.tsx").includes("FUENTES OFICIALES {league}"),
  "Movement summary identifies separate LMB and LMP institutional sources");

const staffSection=read("components/OfficialStaffHistorySection.tsx");
check(staffSection.includes('verifiedPersonnelEventsForClub(league,clubSlug)') &&
  staffSection.includes('item.sourceUrl===event.url') &&
  staffSection.includes('item.title.includes(event.person) || item.excerpt.includes(event.person)'),
  "Staff summary suppresses only verified duplicate announcements already present in movement previews");
check(staffSection.includes("ni confirma por sí solo quién ocupa actualmente") &&
  staffSection.includes("Anuncios oficiales documentados") &&
  staffSection.includes("Consultar comunicado oficial"),
  "Staff summary clearly identifies a historical announcement, not a current-team claim");
const staffWiring=[
  "app/equipos/lmb/[slug]/page.tsx",
  "app/equipos/lmb/algodoneros/page.tsx",
  "components/LmpDirectoryClubProfile.tsx",
  "app/equipos/lmp/algodoneros/page.tsx"
];
for(const path of staffWiring){
  check(read(path).includes("<OfficialStaffHistorySection") &&
    read(path).includes("recentPreview={movementPreview}"),
    "Historical staff section is uniformly available in "+path);
}

const naranjerosStaffUrl="https://editor.lmp.mx/definido-el-cuerpo-tecnico-de-naranjeros/";
const naranjerosCoaches=[
  ["Gil Velázquez","Coach de banca"],
  ["Giovanni Carrara","Coach de pitcheo"],
  ["Mike Jacobs","Coach de bateo"],
  ["Ever Magallanes","Coach de primera base"]
];
for(const [person,role] of naranjerosCoaches){
  const event=verifiedPersonnelEventsForClub("LMP","naranjeros")
    .find(item=>item.person===person);
  check(Boolean(event && event.date==="2026-07-23" &&
    event.kind==="coach-addition" && event.role===role &&
    event.url===naranjerosStaffUrl),
  "Naranjeros official July 23 staff announcement documents "+person+" without roster inference");
}
check(read("components/OfficialStaffHistorySection.tsx").includes("const grouped=new Map") &&
  read("components/OfficialStaffHistorySection.tsx").includes("group.length") &&
  read("components/OfficialStaffHistorySection.tsx").includes("group.map(member=>"),
  "A shared staff article displays all confirmed coaches in one source card without dropping names");

const {verifiedLmbPlayerAnnouncements,verifiedLmbPlayerNewsForClub,isVerifiedLmbPlayerAnnouncementSource}
 =require("../lib/verifiedLmbPlayerAnnouncements.ts");
const alvaradoUrl="https://lmb.com.mx/noticias/cristian-alvarado-esta-de-vuelta-con-los-guerreros-de-oaxaca";
const alvarado=verifiedLmbPlayerAnnouncements("https://lmb.com.mx/equipos/guerreros")[0];
check(alvarado?.player==="Cristian Alvarado" &&
  alvarado.date==="2026-11-07" && alvarado.kind==="return-announced" &&
  alvarado.description.includes("no por sí solo un alta"),
  "Oaxaca return is a documented announcement, never a confirmed reserve-list roster activation");
check(verifiedLmbPlayerAnnouncements("https://lmb.com.mx/equipos/leones").length===0 &&
  verifiedLmbPlayerNewsForClub("leones",alvaradoUrl).length===0,
  "An announced Oaxaca pitcher cannot appear on Leones roster/movements");
check(verifiedLmbPlayerNewsForClub("guerreros",alvaradoUrl)[0]?.player==="Cristian Alvarado" &&
  isVerifiedLmbPlayerAnnouncementSource(alvaradoUrl),
  "Only the specific official Oaxaca return article is linked as a historical event");
check(verifiedLmbPlayerNewsForClub("guerreros",alvaradoUrl+"?utm_source=untrusted").length===0 &&
  !isVerifiedLmbPlayerAnnouncementSource("https://lmb.com.mx.evil.example/noticias/"+alvaradoUrl.split("/").pop()),
  "Player announcement verification rejects query aliases and fake LMB domains");
const playerReturnPreview=previewLmbMovements([{
  date:alvarado.date,title:"Regreso anunciado: "+alvarado.player,
  description:alvarado.description,url:alvarado.url,
  sourceKind:"official-player-announcement",automatic:false
}]);
check(playerReturnPreview[0]?.kind==="official-player-announcement" &&
  playerReturnPreview[0].sourceUrl===alvaradoUrl,
  "The movement preview calls a return a club announcement, not a roster transaction");
check(previewLmbMovements([{
  date:alvarado.date,title:"Regreso anunciado: "+alvarado.player,
  description:alvarado.description,url:"https://lmb.com.mx/noticias/another-pitcher-return",
  sourceKind:"official-player-announcement",automatic:false
}]).length===0,
  "Unverified player-return article cannot inherit the approved source label");
check(read("lib/lmbMovements.ts").includes("verifiedLmbPlayerAnnouncements(config.profileUrl)") &&
  read("lib/lmbMovements.ts").includes('type:"Anuncio del club · Regreso de jugador"') &&
  read("components/OfficialMovementPreviewSection.tsx").includes("REGRESO ANUNCIADO · NO ALTA DE ROSTER"),
  "Oaxaca movements and preview display club-announced player return separately from confirmed roster moves");
for(const page of ["app/equipos/lmb/[slug]/page.tsx","app/equipos/lmb/algodoneros/page.tsx"]){
  check(read(page).includes("verifiedLmbPlayerNewsForClub(") &&
    read(page).includes("REGRESO ANUNCIADO · NO ALTA DE ROSTER"),
    "The official club article has an evidence-gated news-to-movements link in "+page);
}
const jaguaresPreview=previewLmpMovements([{
  date:jaguaresStaff[0].date,
  description:jaguaresStaff[0].description,
  sourceKind:"official-appointment",
  staffKind:jaguaresStaff[0].kind,
  sourceUrl:jaguaresStaff[0].url,
  person:jaguaresStaff[0].person
}]);
check(jaguaresPreview.length===1 &&
  jaguaresPreview[0].staffKind==="replacement" &&
  jaguaresPreview[0].sourceUrl===jaguaresStaff[0].url &&
  jaguaresPreview[0].title==="Erik Rodríguez",
  "Verified Jaguares manager replacement has event-specific source and no fake roster movement");
check(previewLmpMovements([{...jaguaresStaff[0],sourceKind:"official-appointment",
  sourceUrl:"https://fake-lmp.example/nuevo-manager",person:"Erik Rodríguez",staffKind:"replacement"}]).length===0,
  "A fake LMP site cannot insert a manager into the official movement preview");
check(read("lib/lmpClubDirectoryData.ts").includes('verifiedPersonnelEventsForClub("LMP",slug)') &&
  read("components/LmpMovementTimeline.tsx").includes("staffEventLabel(item.staffKind!)") &&
  read("components/LmpMovementTimeline.tsx").includes("Consultar anuncio oficial LMP"),
  "LMP staff events are separate from roster API and link the individual official article");

const lmpMovementsExample=[
 {date:"2026-11-15",description:"Algodoneros de Guasave informa la activación de José Álvarez, desactivando a Joel Rangel."},
 {date:"2026-11-13",description:"Algodoneros de Guasave informa la activación de Carlos Vázquez y Joel Rangel, inactivando a Jorge Monroy."}
];
check(previewLmpMovements(lmpMovementsExample).length===2,
  "LMP preview accepts two distinct dated official movement entries");
check(previewLmpMovements([...lmpMovementsExample,lmpMovementsExample[0]]).length===2,
  "LMP preview deduplicates identical movements in the official record");
check(previewLmpMovements(lmpMovementsExample)[0].sourceUrl===null,
  "LMP movements never invent individual bulletin URLs unavailable in the API");
check(previewLmpMovements([{date:"",description:"Se activó José Álvarez"}]).length===0,
  "Undated LMP movements are not displayed as verified");
check(previewLmpMovements([{date:"2026-11-15",description:"Alta"}]).length===0,
  "Incomplete LMP official movements are not treated as informative previews");
check(previewLmpMovements([{date:"2026-11-15",description:"A".repeat(250)}])[0].excerpt.includes("Extracto"),
  "Truncated LMP movements explicitly tell readers to consult full official record");
const previewComponent=read("components/OfficialMovementPreviewSection.tsx");
check(previewComponent.includes('"REGISTRO " + league') &&
  previewComponent.includes("item.sourceUrl ?? movementsHref") &&
  previewComponent.includes("no acreditan por sí solos los titulares periodísticos."),
  "Shared news-adjacent panel separates journalism from official roster evidence");
check(read("app/equipos/lmb/[slug]/page.tsx").includes('previewLmbMovements(movements?.movements ?? [])') &&
  read("app/equipos/lmb/algodoneros/page.tsx").includes("previewLmbMovements(movementResult?.movements ?? [])") &&
  read("app/equipos/lmp/[slug]/page.tsx").includes('view==="resumen")?getLmpDirectoryMovements(club.id)') &&
  read("app/equipos/lmp/algodoneros/page.tsx").includes("previewLmpMovements(movements)"),
  "Preview source wiring covers 20 LMB and 10 LMP club profiles");
check(read("lib/lmbMovements.ts").includes("config.maxCandidates ?? 24"),
  "LMB summary loads only bounded recent bulletins, movement tab retains full coverage");

const lmbSource=read("lib/lmbClubContent.ts");
check(lmbSource.includes('">Noticias principales<"')&&lmbSource.includes('">Más Noticias<"'),"LMB reads both news sections");
check(lmbSource.includes("if (!news.length)")&&!lmbSource.includes("if (news.length < 3)"),"LMB retains one or two fresh official stories");
check(lmbSource.includes('stories: [], sourceStatus: "fallback"'),"LMB does not pass old archive as current news");
check(lmbSource.includes("const REVALIDATE_SECONDS = 900"),"LMB official content 15-minute cache");
const lmpSource=read("lib/lmpClubDirectoryData.ts");
const {LMP_OFFICIAL_NEWS_TAGS}=require("../lib/lmpOfficialNewsTags.ts");
const tagged=new Set(Object.keys(LMP_OFFICIAL_NEWS_TAGS).map(Number));
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
check(mlbPage.includes("findVerifiedMlbRelease(news.items[0], transactions.items)") &&
  mlbPage.includes("findVerifiedMlbRelease(story, transactions.items)") &&
  mlbPage.includes("LIBERACIÓN REGISTRADA · MLB") &&
  mlbPage.includes('item.isConfirmedRelease ? "LIBERACIÓN REGISTRADA" : item.label') &&
  mlbPage.includes("La liberación está registrada; no se infiere"),
  "MLB release badge is evidence-gated in news while release differs from DFA in movements");
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
