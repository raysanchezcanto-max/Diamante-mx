import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const path = q.get("path") || "/";
  const asset = q.get("asset");
  let target: URL;
  try {
    target = new URL(asset || path, "https://www.lmp.mx/");
  } catch { return NextResponse.json({ error: "bad url" }, { status: 400 }); }
  if (!["lmp.mx","www.lmp.mx","static.lmp.mx"].includes(target.hostname))
    return NextResponse.json({ error: "host not permitted" }, { status: 400 });
  try {
    const r = await fetch(target.toString(), {cache:"no-store",redirect:"follow",signal:AbortSignal.timeout(18000),
      headers:{"Accept":"text/html,image/*,*/*","User-Agent":"Mozilla/5.0"}});
    const b=Buffer.from(await r.arrayBuffer()), typ=r.headers.get("content-type")||"";
    if (asset) return NextResponse.json({status:r.status,url:r.url,type:typ,bytes:b.length,
      base64:b.length<1200000?b.toString("base64"):null});
    const html=b.toString("utf8");
    const images=[...html.matchAll(/<img\\b[^>]*>/gi)].map(m=>m[0]).slice(0,250).map(tag=>({
      alt:tag.match(/\\balt=["']([^"']*)["']/i)?.[1]||"",
      src:tag.match(/\\b(?:src|data-src)=["']([^"']*)["']/i)?.[1]||"",
      className:tag.match(/\\bclass=["']([^"']*)["']/i)?.[1]||"",
      raw:tag.slice(0,500)
    }));
    const teamSnippets=[...html.matchAll(/(?:Algodoneros|Guasave|Charros|Jalisco|Mayos|Navojoa|Jaguares|Venados|Mazatlán|MXC|GSV|NAY|NAV|JAL|MAZ)/gi)]
      .slice(0,55).map(m=>html.slice(Math.max(0,m.index-250),Math.min(html.length,m.index+360)));
    const assets=[...html.matchAll(/(?:src|href)=["']([^"']+\\.(?:svg|png|webp)(?:\\?[^"']*)?)["']/gi)].slice(0,200).map(m=>m[1]);
    return NextResponse.json({status:r.status,url:r.url,type:typ,bytes:b.length,images,assets,teamSnippets});
  } catch(e) {return NextResponse.json({error:String(e),url:target.toString()});}
}