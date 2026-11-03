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
 logoMentions:[...html.matchAll(/logo/gi)].slice(0,30).map(m=>html.slice(Math.max(0,m.index-230),Math.min(html.length,m.index+440))),
 headerUrls:[...new Set([...html.matchAll(/(?:src|href|url)=[\"']([^\"']+)[\"']/gi)].map(x=>x[1]).filter(x=>/asset|logo|brand|image|icon|storage/i.test(x)))].slice(0,95),
 headerPreview:html.slice(html.indexOf("<body"),html.indexOf("<body")+10000),
 urls:[...new Set([...html.matchAll(/(?:https?:\/\/|\/)[^"'\s<>]{0,140}(?:logo|Logo|LMB|LMP|caribe)[^"'\s<>]{0,140}/g)].map(x=>x[0]))].slice(0,25),
 preview:html.slice(0,1700)
});
export async function GET(request: Request){
 const images: Record<string,string> = {
   mlb:"https://www.mlbstatic.com/team-logos/league-on-dark/1.svg",
   lmb:"https://lmb.com.mx/images/logo.png",
   lmp:"https://www.lmp.mx/assets/img/header/lmp_logo_header.png",
   caribe:"https://www.seriedelcaribe.net/storage/images/CoAHHyMHLi2kFNkJRU3G6LcqpLbhVbIHYOHaMvHy.svg"
 };
 const imageKey = new URL(request.url).searchParams.get("image") ?? "";
 if (images[imageKey]) {
  try{
   const response = await fetch(images[imageKey],{cache:"no-store",signal:AbortSignal.timeout(10000)});
   const content = Buffer.from(await response.arrayBuffer());
   return NextResponse.json({key:imageKey,status:response.status,url:images[imageKey],type:response.headers.get("content-type"),size:content.length,base64:content.toString("base64")});
  }catch(e){return NextResponse.json({key:imageKey,error:String(e)});}
 }

 const results=await Promise.all(Object.entries(domains).map(async ([key,url])=>{
 try{const r=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8000)});
 const html=await r.text();
 return {key,url,status:r.status,contentType:r.headers.get("content-type"),bytes:html.length,...extract(html)};}
 catch(e){return {key,error:String(e)}}}));
 return NextResponse.json({results});
}
