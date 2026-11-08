// Temporary public YouTube page inspection. Remove after QA.
export const runtime="nodejs";export const dynamic="force-dynamic";
function dataFor(html:string,prefix:string):unknown {
 const a=html.indexOf(prefix);if(a<0)return null;
 const start=html.indexOf("{",a+prefix.length),end=html.indexOf(";</script>",start);
 if(start<0||end<0||end-start>2_000_000)return null;
 try{return JSON.parse(html.slice(start,end))}catch{return null}
}
async function video(videoId:string) {
 const url=`https://www.youtube.com/watch?v=${videoId}`;
 try{
  const res=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(9000),headers:{Accept:"text/html"}});
  const html=await res.text();
  const data=dataFor(html,"var ytInitialPlayerResponse = ") ??
    dataFor(html,"ytInitialPlayerResponse = ");
  const p=data as {videoDetails?:Record<string,unknown>;playabilityStatus?:Record<string,unknown>;microformat?:{playerMicroformatRenderer?:Record<string,unknown>}}|null;
  const meta=p?.microformat?.playerMicroformatRenderer;
  return {id:videoId,http:res.status,bytes:html.length,hasPlayer:!!p,
    details:{title:p?.videoDetails?.title,author:p?.videoDetails?.author,channelId:p?.videoDetails?.channelId,lengthSeconds:p?.videoDetails?.lengthSeconds,isLiveContent:p?.videoDetails?.isLiveContent,isPrivate:p?.videoDetails?.isPrivate},
    playability:{status:p?.playabilityStatus?.status,reason:p?.playabilityStatus?.reason,playableInEmbed:p?.playabilityStatus?.playableInEmbed},
    microformat:{isFamilySafe:meta?.isFamilySafe,publishDate:meta?.publishDate,uploadDate:meta?.uploadDate,liveBroadcastDetails:meta?.liveBroadcastDetails},
    titleMeta:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.slice(0,160),
    playerMarker:html.indexOf("ytInitialPlayerResponse"),
    snippet:html.slice(Math.max(0,html.indexOf('"lengthSeconds"')-120),html.indexOf('"lengthSeconds"')+170)};
 }catch(e){return{id:videoId,error:String(e)}}
}
async function streamCard(){
 try{
  const r=await fetch("https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/streams",{cache:"no-store",signal:AbortSignal.timeout(8000)});
  const html=await r.text();
  const raw=dataFor(html,"var ytInitialData = ");
  const cards:Array<Record<string,unknown>>=[];
  const visit=(v:unknown,depth:number)=>{
   if(depth>45||v===null||typeof v!=="object")return;
   if(Array.isArray(v)){for(const a of v)visit(a,depth+1);return}
   const o=v as Record<string,unknown>;
   if(o.lockupViewModel&&typeof o.lockupViewModel==="object"){
    const lock=o.lockupViewModel as Record<string,unknown>;
    if(["UnPc8ktTsq8","oPAPcWxbVNM","uaEjVDAelFg"].includes(String(lock.contentId??"")))cards.push(lock);
   }
   for(const x of Object.values(o))visit(x,depth+1);
  };visit(raw,0);
  return cards.map(v=>({id:v.contentId,payload:JSON.stringify(v).slice(0,3500)}));
 }catch(e){return {error:String(e)}}
}
export async function GET(){
 const [videos,streamCards]=await Promise.all([Promise.all(["UnPc8ktTsq8","oPAPcWxbVNM","QbObuwwo8Z4"].map(video)),streamCard()]);
 return Response.json({videos,streamCards},{headers:{"Cache-Control":"no-store"}});
}
