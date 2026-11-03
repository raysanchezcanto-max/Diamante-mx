import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const sources: Record<string,string> = {
  guasaveCap: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Algodoneros_de_Guasave_cap_insignia.svg",
  guasaveHome: "https://losalgodoneros.com/",
  guasaveSocial: "https://pbs.twimg.com/profile_images/2015953851849826304/aGukozlt_400x400.jpg",
  venadosAvatar: "https://media1.giphy.com/avatars/Venados/Si1XFveQJLqr.png",
  mayosHome: "https://mayosdenavojoa.com/",
  mayosLegacy: "https://www.mayosbeisbol.mx/mayosdenavojoa.jpg",
  lmpHome: "https://www.lmp.mx/",
  guasaveOld: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_de_Algodoneros_de_Guasave.png",
};
const clean=(s:string)=>s.replace(/&amp;/g,"&").replace(/&quot;/g,'"');
export async function GET(req:Request){
  const name=new URL(req.url).searchParams.get("name")??"";
  if(!Object.prototype.hasOwnProperty.call(sources,name))return NextResponse.json({sources:Object.keys(sources)});
  const target=sources[name];
  try {
    const result=await fetch(target,{cache:"no-store",redirect:"follow",signal:AbortSignal.timeout(12000),headers:{"User-Agent":"Mozilla/5.0 (compatible; LogoAudit/1.0)","Accept":"image/svg+xml,image/png,image/jpeg,text/html,*/*"}});
    const contentType=result.headers.get("content-type")??"";
    const raw=Buffer.from(await result.arrayBuffer());
    const base={name,status:result.status,url:result.url,contentType,bytes:raw.length};
    if(contentType.includes("html")){
      const html=raw.toString("utf8");
      const matches=[...html.matchAll(/<img\\b[^>]*>/gi)].slice(0,90).map(x=>({
        alt:clean(x[0].match(/\\balt=["']([^"']*)["']/i)?.[1]??""),
        src:clean(x[0].match(/\\b(?:src|data-src)=["']([^"']*)["']/i)?.[1]??""),
      }));
      const srcs=[...html.matchAll(/["']([^"']*(?:logo|escudo|algod|mayos|venados|jaguares)[^"']*\\.(?:png|svg|webp)[^"']*)["']/gi)].slice(0,70).map(x=>x[1]);
      return NextResponse.json({...base,images:matches,assets:srcs},{headers:{"Cache-Control":"no-store"}});
    }
    if(raw.length>1_800_000)return NextResponse.json({...base,error:"too_large"});
    return NextResponse.json({...base,head:raw.subarray(0,100).toString("utf8"),base64:raw.toString("base64")},{headers:{"Cache-Control":"no-store"}});
  }catch(e){return NextResponse.json({name,error:String(e)});}
}
