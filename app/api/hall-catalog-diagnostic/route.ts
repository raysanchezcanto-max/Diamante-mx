// Temporary public-source diagnostic: removed after validation.
export const dynamic="force-dynamic";
export async function GET(){
  const url="https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico";
  try{
    const r=await fetch(url,{cache:"no-store",headers:{"User-Agent":"Mozilla/5.0 (compatible; DiamanteMX/1.0)","Accept":"text/html"},signal:AbortSignal.timeout(11000)});
    const s=await r.text();
    const keys=["Martín Dihigo","Guillermo Garibay","Antonio Pollorena","Abel Francisco Cano","Fernando Valenzuela","Javier Robles","2025","INMORTALES POR ORDEN ALFABÉTICO"];
    const items=Object.fromEntries(keys.map(k=>{
      const i=s.toLowerCase().indexOf(k.toLowerCase());
      return [k,i<0?null:{position:i,fragment:s.slice(Math.max(0,i-350),i+500)}];
    }));
    const before=s.indexOf("Abel Francisco Cano");
    const after=s.indexOf("Yovani Gallardo");
    const snippet=before>=0&&after>=before?s.slice(before,Math.min(after,before+2500)):null;
    return Response.json({status:r.status,size:s.length,contentType:r.headers.get("content-type"),items,snippet:snippet?.slice(0,1600)});
  }catch(e){return Response.json({error:String(e)})}
}