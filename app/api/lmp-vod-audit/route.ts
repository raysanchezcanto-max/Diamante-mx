// Temporary read-only LMP public catalog QA. Delete after verification.
export const runtime="nodejs";
export const dynamic="force-dynamic";
async function probe(name:string,url:string){
  try {
    const r=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(9000),headers:{Accept:"text/html"}});
    const html=await r.text();
    const needles=["7 de noviembre de 2026","7 de Noviembre de 2026","2026-11-07","850466","VENADOS","Venados","Mayos","Juego completo","RESUMEN","/videos/","youtube.com/watch","watch?v=","UCdW_4rN3OarOoawQ4Er-ZXw","videoRenderer","videoId","members-only"];
    const hits=Object.fromEntries(needles.map(k=>[k,html.toLowerCase().indexOf(k.toLowerCase())]).filter(x=>Number(x[1])>=0));
    const videoPaths=[...new Set([...html.matchAll(/(?:href=|https?:\/\/www\.lmp\.mx)(?:"|')?\/?videos\/([A-Za-z0-9_-]{8,15})/g)].map(m=>m[1]))].slice(0,20);
    const ytIds=[...new Set([...html.matchAll(/(?:v=|embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/g)].map(m=>m[1]))].slice(0,20);
    const snippet=Object.fromEntries(["850466","Venados","Mayos","resumen","juego completo"].map(k=>[k,html.slice(Math.max(0,html.toLowerCase().indexOf(k.toLowerCase())-80),html.toLowerCase().indexOf(k.toLowerCase())+240)]).filter(([,v])=>!!v&&!String(v).includes("<!DOCTYPE html>")));
    return{name,http:r.status,bytes:html.length,finalUrl:r.url,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.slice(0,130),hits,videoPaths,ytIds,snippet,first:html.slice(0,150)};
  }catch(e){return{name,error:String(e)}}
}
export async function GET(){
 const urls:[string,string][]=[
 ["lmp-videos","https://www.lmp.mx/videos"],
 ["lmp-youtube","https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/videos"],
 ["lmp-youtube-handle","https://www.youtube.com/@lmpbanamex/videos"],
 ["lmp-tv-old","https://tv.lmp.mx/"],
 ];
 return Response.json({results:await Promise.all(urls.map(([name,url])=>probe(name,url)))},{headers:{"Cache-Control":"no-store"}});
}
