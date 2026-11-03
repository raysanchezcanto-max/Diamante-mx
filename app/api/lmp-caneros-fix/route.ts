import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const v = p.get("v") ?? "a";
  const samples: Record<string, [number,number,number,number]> = {
    a: [180, 74, 27, 27],
    b: [178, 73, 30, 29],
    c: [181, 75, 26, 25],
  };
  if (!samples[v]) return NextResponse.json({error:"invalid variant"},{status:400});
  try {
    const sharp=(await import("sharp")).default;
    const resp = await fetch("https://www.lmp.mx/assets/img/icons/LaMP_Iconos_wbc_10.webp",
      {cache:"no-store",signal:AbortSignal.timeout(13000)});
    if (!resp.ok) throw new Error("sprite response "+resp.status);
    const source = Buffer.from(await resp.arrayBuffer());
    const metadata=await sharp(source).metadata();
    const scale=(metadata.width??0)/392;
    if(!scale)throw new Error("no sprite size");
    const [x,y,w,h]=samples[v];
    const cropped=await sharp(source).extract({
      left:Math.round(x*scale),top:Math.round(y*scale),
      width:Math.round(w*scale),height:Math.round(h*scale)
    }).png().toBuffer();
    const cm=await sharp(cropped).metadata();
    const border=20;
    const padded=await sharp({create:{width:(cm.width??0)+border*2,height:(cm.height??0)+border*2,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
      .composite([{input:cropped,left:border,top:border}]).png().toBuffer();
    return NextResponse.json({variant:v,sourceSize:metadata.width,crop:{x,y,w,h},width:(cm.width??0)+border*2,
      height:(cm.height??0)+border*2,bytes:padded.length,base64:padded.toString("base64")});
  } catch(e){return NextResponse.json({error:String(e)},{status:500})}
}