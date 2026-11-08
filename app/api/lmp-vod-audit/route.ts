// Temporary read-only verification of official LMP channel metadata.
// Remove this diagnostic once production lookup is validated.
export const runtime="nodejs";export const dynamic="force-dynamic";
type R={title?:string;videoId?:string;duration?:string;kind?:string;badges?:unknown};
function parseInitialData(html:string): unknown {
 for(const prefix of ["var ytInitialData = ","window[\"ytInitialData\"] = ","ytInitialData = "]) {
  const a=html.indexOf(prefix);
  if(a<0)continue;
  const start=html.indexOf("{",a+prefix.length);
  const end=html.indexOf(";</script>",start);
  if(start<0||end<0||end-start>2_000_000)continue;
  try{return JSON.parse(html.slice(start,end));}catch{}
 }
 return null;
}
function extract(data:unknown):R[] {
 const list:R[]=[];
 const seen=new Set<string>();
 const visit=(v:unknown,depth:number)=>{
  if(depth>45||!v||typeof v!=="object")return;
  if(Array.isArray(v)){for(const x of v)visit(x,depth+1);return}
  const ob=v as Record<string,unknown>;
  const videoRenderer=ob.videoRenderer as Record<string,unknown>|undefined;
  const lockup=ob.lockupViewModel as Record<string,unknown>|undefined;
  if(videoRenderer&&typeof videoRenderer.videoId==="string"){
   const title=videoRenderer.title as {runs?:Array<{text?:string}>}|undefined;
   const duration=videoRenderer.lengthText as {simpleText?:string}|undefined;
   if(!seen.has(videoRenderer.videoId)){seen.add(videoRenderer.videoId);list.push({kind:"videoRenderer",videoId:videoRenderer.videoId,title:title?.runs?.map(x=>x.text||"").join(""),duration:duration?.simpleText})}
  }
  if(lockup){
   const id=lockup.contentId;
   const metadata=lockup.metadata as Record<string,unknown>|undefined;
   const vm=metadata?.lockupMetadataViewModel as Record<string,unknown>|undefined;
   const name=(vm?.title as Record<string,unknown>|undefined)?.content;
   const img=lockup.contentImage as Record<string,unknown>|undefined;
   const overlay=img?.collectionThumbnailViewModel as Record<string,unknown>|undefined;
   if(typeof id==="string"&&!seen.has(id)){seen.add(id);list.push({kind:"lockup",videoId:id,title:typeof name==="string"?name:undefined,duration:JSON.stringify(overlay||{}).match(/\d+:\d+(?::\d+)?/)?.[0]})}
  }
  for(const val of Object.values(ob))visit(val,depth+1);
 };
 visit(data,0);return list;
}
async function probe(name:string,url:string){
 try{
  const res=await fetch(url,{next:{revalidate:30},signal:AbortSignal.timeout(9000),headers:{Accept:"text/html"}});
  const html=await res.text();
  const start=html.indexOf("var ytInitialData = ");
  const data=parseInitialData(html);
  const vids=extract(data);
  const relevant=vids.filter(x=>/7 de noviembre|november 7|venados|mayos|juego completo|partido completo|juego [12]/i.test(x.title||""));
  return{name,http:res.status,bytes:html.length,initialMarker:start,parsed:!!data,totalVideos:vids.length,relevant:relevant.slice(0,40),top:vids.slice(0,25),htmlNearGame:html.slice(Math.max(0,html.indexOf("HIGHLIGHTS | Venados")-400),html.indexOf("HIGHLIGHTS | Venados")+300)};
 }catch(e){return{name,error:String(e)}}
}
export async function GET(){return Response.json({res:await Promise.all([
 probe("videos","https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/videos"),
 probe("streams","https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/streams")
 ])},{headers:{"Cache-Control":"no-store"}})}
