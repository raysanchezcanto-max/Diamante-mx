// Temporary public source diagnostic. Remove on next commit.
export const dynamic="force-dynamic";
export async function GET(){
 const clubs=["acereros","saraperos","diablos-rojos","guerreros","pericos","piratas","tigres","bravos","olmecas","dorados","conspiradores"];
 const results=await Promise.all(clubs.map(async slug=>{
  try{
   const r=await fetch("https://lmb.com.mx/equipos/"+slug+"/roster",{
     cache:"no-store",headers:{"Accept":"text/html"},signal:AbortSignal.timeout(12000),
   });
   const html=await r.text();
   const split=html.indexOf("(self.__next_f");
   const indices={
     rosterTitle:html.indexOf("RosterList_headerTitle"),
     rosterHeader:html.indexOf("Roster"),
     playerLink:html.indexOf('href="/jugador/'),
     playerAlt:html.indexOf('alt="'),
     script:split,
     embeddedId:html.indexOf("594105"),
   };
   const items=(html.match(/\/jugador\/\d+/g)||[]).length;
   const headings=(html.match(/RosterList_headerTitle/g)||[]).length;
   const example=indices.playerLink>=0?html.slice(indices.playerLink,indices.playerLink+190):null;
   const firstHeading=indices.rosterTitle>=0?html.slice(indices.rosterTitle-120,indices.rosterTitle+180):null;
   return {slug,status:r.status,bytes:html.length,indices,items,headings,firstHeading,example,contentType:r.headers.get("content-type")};
  }catch(e){return {slug,error:String(e)};}
 }));
 return Response.json(results);
}