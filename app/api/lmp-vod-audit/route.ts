// Temporary diagnostic for older official YouTube archived video. Delete after QA.
export const dynamic="force-dynamic";export const runtime="nodejs";
export async function GET(){
 const q="Cañeros Yaquis 25 octubre 2026", id="9L-prlH7Tqo";
 const urls=[
  ["search","https://www.youtube.com/@lmpbanamex/search?query="+encodeURIComponent(q)],
  ["watch","https://www.youtube.com/watch?v="+id],
 ];
 const res=await Promise.all(urls.map(async([name,url])=>{
  try{
   const r=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(9000),headers:{Accept:"text/html"}});
   const html=await r.text();
   const mark=name==="watch"?"var ytInitialPlayerResponse = ":"var ytInitialData = ";
   const a=html.indexOf(mark),start=html.indexOf("{",a+mark.length),end=html.indexOf(";</script>",start);
   let data:unknown=null;
   if(a>=0&&start>=0&&end>=0){try{data=JSON.parse(html.slice(start,end))}catch{}}
   const p=data as {videoDetails?:Record<string,unknown>;playabilityStatus?:Record<string,unknown>;microformat?:{playerMicroformatRenderer?:Record<string,unknown>}}|null;
   return {name,http:r.status,bytes:html.length,hasId:html.includes(id),marker:a,parsed:!!data,
    videoDetails:p?.videoDetails,playability:p?.playabilityStatus,microformat:p?.microformat?.playerMicroformatRenderer,
    hasTitle:html.includes("Cañeros de los Mochis vs Yaquis de Ciudad Obregon | 25 de octubre de 2026"),
    matchAround:html.slice(Math.max(0,html.indexOf(id)-150),html.indexOf(id)+300)};
  }catch(e){return {name,error:String(e)}}
 }));
 return Response.json({res},{headers:{"Cache-Control":"no-store"}});
}
