export const dynamic="force-dynamic";
export async function GET(){
 const dates=["20-de-julio-de-2026","9-de-julio-de-2026","7-de-julio-de-2026","19-de-junio-de-2026","16-de-julio-de-2026"];
 return Response.json(await Promise.all(dates.map(async date=>{
  try{
   const r=await fetch("https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-"+date,{cache:"no-store",signal:AbortSignal.timeout(10000)});
   const html=await r.text();
   const variants=[
    "TABASCO","Tabasco","\\u003cp\\u003e","\\\\u003cp\\\\u003e","\\u003cstrong\\u003e",
    "TABASCO\\u003c","TABASCO</","TABASCO\\\\u003c","Activa en roster"
   ];
   const idx=Object.fromEntries(variants.map(k=>[k,html.indexOf(k)]));
   const samples=Object.fromEntries(["TABASCO","Activa en roster","Olmecas de Tabasco","LAGUNA","MONCLOVA"].map(k=>{
    const i=html.indexOf(k);return[k,i<0?null:html.slice(Math.max(0,i-320),i+1600)];
   }));
   return {date,status:r.status,len:html.length,indices:idx,samples};
  }catch(e){return{date,error:String(e)}}
 })));
}