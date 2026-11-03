import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
const sources={
  leones:"https://upload.wikimedia.org/wikipedia/commons/7/76/Leones_de_Yucatan_cap_insignia.svg",
  guerreros:"https://upload.wikimedia.org/wikipedia/commons/3/3a/Guerreros_de_Oaxaca_insignia.svg",
};
export async function GET(req:Request){
 const key=new URL(req.url).searchParams.get("team") as keyof typeof sources;
 const url= sources[key];
 if(!url) return NextResponse.json({error:"unknown"},{status:404});
 try{
  const r=await fetch(url,{headers:{"User-Agent":"DiamanteMX/1.0 (logo audit)","Accept":"image/svg+xml,*/*"},signal:AbortSignal.timeout(8000),cache:"no-store"});
  const bytes=Buffer.from(await r.arrayBuffer());
  return NextResponse.json({key,status:r.status,type:r.headers.get("content-type"),bytes:bytes.length,base64:r.ok?bytes.toString("base64"):undefined,preview:r.ok?bytes.toString("utf8").slice(0,400):bytes.toString("utf8").slice(0,200)});
 }catch(e){return NextResponse.json({key,error:String(e)});}
}
