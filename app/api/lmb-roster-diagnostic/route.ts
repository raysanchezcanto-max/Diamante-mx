// Temporary public source diagnostic. Remove on next commit.
export const dynamic="force-dynamic";
export async function GET(){
 const clubs=["acereros","saraperos","diablos-rojos","olmecas"];
 const results=await Promise.all(clubs.map(async slug=>{
  try{
   const r=await fetch("https://lmb.com.mx/equipos/"+slug+"/roster",{
     cache:"no-store",headers:{"Accept":"text/html"},signal:AbortSignal.timeout(12000),
   });
   const all=await r.text();const html=all.slice(0,all.indexOf("(self.__next_f")>=0?all.indexOf("(self.__next_f"):undefined);
   const first=html.indexOf("RosterList_headerTitle");
   const last=html.indexOf(">Titulares<",first);
   const section=html.slice(Math.max(0,first-500),last>first?last:Math.min(html.length,first+140000));
   const groups=[...section.matchAll(/<h3\b[^>]*class="[^"]*RosterList_headerTitle[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi)].map(m=>m[1]);
   const links=[...section.matchAll(/<a\b[^>]*href="\/jugador\/(\d+)"[^>]*>/gi)].slice(0,6).map(m=>{
     const pos=m.index+m[0].length;
     const end=section.indexOf("</a>",pos);
     const card=section.slice(pos,end);
     const alts=[...card.matchAll(/<img\b[^>]*\balt="([^"]+)"/gi)].map(x=>x[1]);
     return {id:m[1],index:m.index,length:end-pos,tooLong:end-pos>7500,alts:alts.slice(0,3),
       first80:card.slice(0,80),hasNumber:alts.some(x=>/#\s*\d{1,3}\s*$/.test(x))};
   });
   return {slug,http:r.status,bytes:all.length,sectionLen:section.length,first,last,groups,links};
  }catch(e){return {slug,error:String(e)};}
 }));
 return Response.json(results);
}