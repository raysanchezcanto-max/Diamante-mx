// Transient source-shape diagnostic, public LMB data only. Remove after validation.
export const dynamic = "force-dynamic";
export async function GET() {
  const urls = ["https://lmb.com.mx/equipos/algodoneros","https://lmb.com.mx/equipos/algodoneros/roster"];
  const result=await Promise.all(urls.map(async u => {
    try {
      const res=await fetch(u,{cache:"no-store",signal:AbortSignal.timeout(12000),headers:{Accept:"text/html"}});
      const html=await res.text();
      const keys=u.endsWith("/roster")?
        ["Aldo Montes","Jorge Ramirez","Lanzadores",'/jugador/594105',"__next_f"]:
        ["Noticias principales","Más Noticias","Últimas Noticias","Toros de Tijuana sentencia","lmb-movimientos-en-listas","/noticias/"];
      const excerpts=Object.fromEntries(keys.map(k=>{
        const i=html.toLowerCase().indexOf(k.toLowerCase());
        return [k,i<0?null:{i,before:html.slice(Math.max(0,i-300),i),after:html.slice(i,i+1300)}];
      }));
      const playerHrefs=[...html.matchAll(/href="([^"]*jugador[^"]*)"[^>]*>([^<]*)/gi)].slice(0,6).map(m=>({href:m[1],name:m[2]}));
      const newsHrefs=[...html.matchAll(/href="(\/noticias\/[^"]+)"[^>]*>([^<]*)/gi)].slice(0,12).map(m=>({href:m[1],name:m[2]}));
      return {url:u,status:res.status,length:html.length,playerHrefs,newsHrefs,excerpts};
    }catch(error){return {url:u,error:String(error)}}
  }));
  return Response.json({result});
}
