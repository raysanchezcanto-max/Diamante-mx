// Temporary read-only YouTube channel-search audit. Delete after QA.
export const runtime="nodejs";export const dynamic="force-dynamic";
function parse(html:string):unknown{
 const mark="var ytInitialData = ";const a=html.indexOf(mark);
 if(a<0)return null;const start=html.indexOf("{",a+mark.length),end=html.indexOf(";</script>",start);
 if(start<0||end<0||end-start>2_000_000)return null;
 try{return JSON.parse(html.slice(start,end))}catch{return null}
}
async function probe(query:string){
 try{
  const url="https://www.youtube.com/@lmpbanamex/search?query="+encodeURIComponent(query);
  const res=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8500),headers:{Accept:"text/html"}});
  const html=await res.text();const data=parse(html);
  const found:Array<{id:string;title:string;duration?:string}>=[];
  const seen=new Set<string>();
  const visit=(v:unknown,depth:number)=>{
   if(depth>45||!v||typeof v!=="object")return;
   if(Array.isArray(v)){for(const t of v)visit(t,depth+1);return}
   const o=v as Record<string,unknown>,lock=o.lockupViewModel as Record<string,unknown>|undefined,vr=o.videoRenderer as Record<string,unknown>|undefined;
   if(lock&&typeof lock.contentId==="string"&&!seen.has(lock.contentId)){
    seen.add(lock.contentId);
    const meta=(lock.metadata as Record<string,unknown>|undefined)?.lockupMetadataViewModel as Record<string,unknown>|undefined;
    const title=(meta?.title as Record<string,unknown>|undefined)?.content;
    const overlays=((((lock.contentImage as Record<string,unknown>|undefined)?.thumbnailViewModel as Record<string,unknown>|undefined)?.overlays)??[]) as Array<Record<string,unknown>>;
    const duration=overlays.map(t=>((t.thumbnailBottomOverlayViewModel as {badges?:Array<{thumbnailBadgeViewModel?:{text?:string}}>}|undefined)?.badges??[]).map(b=>b.thumbnailBadgeViewModel?.text??"").join("")).find(Boolean);
    found.push({id:lock.contentId,title:String(title??""),duration});
   }
   if(vr&&typeof vr.videoId==="string"&&!seen.has(vr.videoId)){
     seen.add(vr.videoId);const title=(vr.title as {runs?:Array<{text?:string}>}|undefined)?.runs?.map(x=>x.text??"").join("");
     found.push({id:vr.videoId,title:title??"",duration:((vr.lengthText as Record<string,unknown>|undefined)?.simpleText as string|undefined)});
   }
   for(const value of Object.values(o))visit(value,depth+1);
  };
  visit(data,0);
  return{query,http:res.status,bytes:html.length,found:found.slice(0,20),relevant:found.filter(t=>/venados|mayos|naranjeros|algodoneros|cañeros|yaquis/i.test(t.title)).slice(0,20)};
 }catch(e){return{query,error:String(e)}}
}
export async function GET(){return Response.json({results:await Promise.all(["Naranjeros Algodoneros 7 Noviembre 2026","Venados Mayos November 7 2026","Cañeros Yaquis 25 octubre 2026"].map(probe))},{headers:{"Cache-Control":"no-store"}})}
