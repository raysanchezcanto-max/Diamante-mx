import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
const domains={
 mlb:"https://www.mlb.com/",
 lmb:"https://lmb.com.mx/",
 lmp:"https://www.lmp.mx/",
 caribe:"https://www.seriedelcaribe.net/",
};
const extract=(html:string)=>({
 meta:[...html.matchAll(/<meta\s+[^>]*(?:og:image|twitter:image)[^>]*>/gi)].map(x=>x[0].slice(0,600)).slice(0,8),
 imgs:[...html.matchAll(/<(?:img|image|link|source)[^>]*(?:logo|Logo|LOGO|favicon|icon|brand|Brand)[^>]*>/g)].map(m=>m[0].slice(0,500)).slice(0,30),
 urls:[...new Set([...html.matchAll(/(?:https?:\/\/|\/)[^"'\s<>]{0,140}(?:logo|Logo|LMB|LMP|caribe)[^"'\s<>]{0,140}/g)].map(x=>x[0]))].slice(0,25),
 preview:html.slice(0,1700)
});
export async function GET(){
 const results=await Promise.all(Object.entries(domains).map(async ([key,url])=>{
 try{const r=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8000)});
 const html=await r.text();
 return {key,url,status:r.status,contentType:r.headers.get("content-type"),bytes:html.length,...extract(html)};}
 catch(e){return {key,error:String(e)}}}));
 return NextResponse.json({results});
}
