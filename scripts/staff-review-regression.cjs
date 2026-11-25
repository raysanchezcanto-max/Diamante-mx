#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const {candidateKey,reviewIssueTemplate}=require("./staff-review-issues.cjs");
const {parseReview,normalizeEvent,insertVerifiedEvent}=require("./staff-review-approval.cjs");
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
const fails=(fn,message)=>{assert.throws(fn,message);checks++;};
const url="https://lmb.com.mx/noticias/rafael-rafy-chaves-regresa-los-planes-de-los-leones-como-coach-de-pitcheo-para-el-2027";
const candidate={league:"LMB",clubSlug:"leones",title:"Rafael Chaves regresa como coach de pitcheo",
  url,proposedKind:"coach-addition",publishedAt:null,status:"pending_review"};
const template=reviewIssueTemplate(candidate);
check(template.title.startsWith("POR VERIFICAR")&&template.body.includes("NO CONFIRMADO")&&
  template.body.includes("NO INDICADA")&&template.labels.includes("editorial-pendiente"),
  "Candidate remains unverified with no fabricated LMB date");
check(template.body.includes("Abrí el artículo original")&&
  template.body.includes("Revisé comunicados posteriores")&&template.body.includes("reviewed"),
  "Reviewer must inspect source and acknowledge evidence");
check(candidateKey(candidate)===candidateKey({...candidate,title:"Nuevo titular"}),
  "Same article cannot produce duplicate issues after headline changes");
fails(()=>reviewIssueTemplate({...candidate,status:"already_verified"}),
  "Already verified announcements cannot enter candidate queue");
fails(()=>reviewIssueTemplate({...candidate,url:"http://evil.example/post"}),
  "Insecure candidate URI rejected");
const ticks=String.fromCharCode(96).repeat(3);
function editableIssue(overrides={}){
 const body=template.body.replace(new RegExp(ticks+"json\\s*(\\{[\\s\\S]*?\\})\\s*"+ticks,"i"),
  (_,raw)=>ticks+"json\n"+JSON.stringify({...JSON.parse(raw),reviewed:true,
    person:"Rafael Chaves",role:"Coach de pitcheo",kind:"coach-addition",date:"2026-11-19",
    effectiveSeason:"2027",
    description:"Leones de Yucatán anunció a Rafael Chaves como integrante del cuerpo técnico en el cargo de coach de pitcheo para 2027.",
    ...overrides},null,2)+"\n"+ticks);
 return {user:{login:"github-actions[bot]"},body};
}
const issue=editableIssue(),review=parseReview(issue);
const event=normalizeEvent(review);
check(review.candidateKey===template.key&&event.person==="Rafael Chaves"&&
  event.kind==="coach-addition"&&event.date==="2026-11-19",
  "Reviewer-approved fields parse into validated draft proposal");
fails(()=>parseReview({...issue,user:{login:"public-contributor"}}),
  "Only bot-created issues are allowed");
fails(()=>parseReview(editableIssue({articleUrl:"https://evil.example/story"})),
  "Reviewer cannot swap original source URL");
for(const [field,value] of [
  ["reviewed",false],["person",""],["role",""],["date","2026-02-30"],
  ["date","2045-01-01"],["effectiveSeason",""],["kind","rumor"],
  ["clubSlug","fake-club"],["description","Se perfila Rafael Chaves como coach"],
  ["articleUrl","https://lmb.com.mx.evil.example/noticias/a"],
  ["person",'A B"; process.exit(0); //']
]){
 fails(()=>normalizeEvent({...review,[field]:value}),
  "Missing, uncertain, unsafe or forged field rejected: "+field);
}
fails(()=>normalizeEvent({...review,kind:"replacement",replaces:""}),
 "Replacement requires a named predecessor");
const fakeRegistry="const EVENTS: readonly VerifiedPersonnelEvent[] = [\n];";
const inserted=insertVerifiedEvent(fakeRegistry,review);
check(inserted.includes('person:"Rafael Chaves"')&&inserted.includes('kind:"coach-addition"')&&
  inserted.includes('date:"2026-11-19"')&&inserted.includes('url:"'+url+'"'),
  "Draft PR inserts source-linked data, not executable issue text");
fails(()=>insertVerifiedEvent(inserted,review),"Source URL cannot appear twice");
fails(()=>insertVerifiedEvent("const OTHER=[];",review),"Unknown ledger structure rejected");
const queue=read("scripts/staff-review-issues.cjs");
const dec=read("scripts/staff-review-approval.cjs");
const audit=read(".github/workflows/staff-announcement-audit.yml");
const approval=read(".github/workflows/staff-review-decision.yml");
check(queue.includes('state=all&per_page=100')&&queue.includes("MAX_NEW_ISSUES=15")&&
  queue.includes("pending_review")&&queue.includes("failures>=10"),
  "Queue remembers rejected issues and bounds amount and source failures");
check(queue.includes('command==="--init-labels" ? ensureLabels()') &&
  queue.includes('module.exports={candidateKey,reviewIssueTemplate,ensureLabels}'),
  "La inicialización de etiquetas puede ejecutarse sin haber leído un informe RSS");
check(audit.includes("node scripts/staff-review-issues.cjs --init-labels") &&
  audit.indexOf("node scripts/staff-review-issues.cjs --init-labels") <
  audit.indexOf("node scripts/staff-announcement-audit.cjs") &&
  audit.includes("continue-on-error: true"),
  "La bandeja inicializa etiquetas antes de consultar las fuentes y conserva diagnósticos si fallan");

check(audit.includes("issues: write")&&audit.includes("node scripts/staff-review-issues.cjs")&&
  audit.includes("GITHUB_TOKEN:")&&!audit.includes("contents: write"),
  "Audit can create Issues but never modify source code");
check(approval.includes("types: [labeled]")&&approval.includes("pull-requests: write")&&
  approval.includes("node scripts/staff-review-approval.cjs"),
  "Decision workflow requires a deliberate editorial label");
check(dec.includes("permission.permission")&&dec.includes('["admin","maintain","write"]')&&
  dec.includes("draft:true")&&!dec.includes("pulls/merge")&&
  !dec.includes("mergePullRequest"),
  "Reviewer must have repo write permission and only draft PR is created");
check(dec.includes('state:"closed",state_reason:"not_planned"'),
  "Rejection closes issue without source publication");
console.log("Editorial review workflow: "+checks+" regression checks OK.");
