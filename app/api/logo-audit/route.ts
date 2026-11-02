import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const leaguePath = "https://lmb.com.mx/equipos";
const teams: Record<string,string> = {
"algodoneros-union-laguna":"Algodoneros",
"tecos-dos-laredos":"Tecos",
"acereros-monclova":"Acereros",
"caliente-durango":"Caliente",
"charros-jalisco":"Charros",
"rieleros-aguascalientes":"Rieleros",
"saraperos-saltillo":"Saraperos",
"sultanes-monterrey":"Sultanes",
"toros-tijuana":"Toros",
"diablos-rojos-mexico":"Diablos Rojos",
"aguila-veracruz":"El Águila",
"guerreros-oaxaca":"Guerreros",
"leones-yucatan":"Leones",
"pericos-puebla":"Pericos",
"piratas-campeche":"Piratas",
"tigres-quintana-roo":"Tigres",
"bravos-leon":"Bravos",
"olmecas-tabasco":"Olmecas",
"dorados-chihuahua":"Dorados",
"conspiradores-queretaro":"Conspiradores",
};

function photoSrc(html: string, alt: string): string|null {
  const imgs=[...html.matchAll(/<img\b[^>]*>/gi)];
  for(const [tag] of imgs) {
    const label=tag.match(/\balt="([^"]+)"/i)?.[1]??"";
    if(label.trim().toLowerCase()!==alt.toLowerCase())continue;
    const src=tag.match(/\bsrc="([^"]+)"/i)?.[1]??"";
    const encoded=src.match(/[?&]url=([^&]+)/)?.[1];
    if(!encoded)continue;
    const decoded=decodeURIComponent(encoded);
    if(decoded.startsWith("https://d11rb39sj794dg.cloudfront.net/public/")&&
      /\.(png|jpe?g|webp)(\?.*)?$/i.test(decoded)) {
        return decoded;
      }
  }
  return null;
}

export async function GET(request: Request){
  const url=new URL(request.url);
  const id=url.searchParams.get("team");
  const page=await fetch(leaguePath,{next:{revalidate:3600},signal:AbortSignal.timeout(9000)});
  if(!page.ok)return NextResponse.json({error:"official_list_unavailable",status:page.status},{status:502});
  const html=await page.text();
  if(!id) {
    const all=Object.entries(teams).map(([name,alt])=>({name,alt,source:photoSrc(html,alt)}));
    return NextResponse.json({teams:all},{headers:{"Cache-Control":"no-store"}});
  }
  if(!(id in teams))return NextResponse.json({error:"unknown_team"},{status:404});
  const source=photoSrc(html,teams[id]);
  if(!source)return NextResponse.json({error:"no_official_logo",id},{status:404});
  // Imagen nítida de 256 px, misma fuente visual LMB, sin redibujar escudos.
  const optimized="https://lmb.com.mx/_next/image?url="+encodeURIComponent(source)+"&w=256&q=85";
  const image=await fetch(optimized,{cache:"no-store",signal:AbortSignal.timeout(10000),headers:{"Accept":"image/webp,image/avif,image/*"}});
  if(!image.ok)return NextResponse.json({error:"cdn_error",status:image.status,id},{status:502});
  const type=image.headers.get("content-type")??"";
  if(!type.startsWith("image/"))return NextResponse.json({error:"not_image",type},{status:502});
  const bytes=Buffer.from(await image.arrayBuffer());
  if(bytes.length<300||bytes.length>500_000)return NextResponse.json({error:"unexpected_size",bytes:bytes.length},{status:502});
  return NextResponse.json({id,source,optimized,type,bytes:bytes.length,base64:bytes.toString("base64")},{headers:{"Cache-Control":"no-store"}});
}
