import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
const icons: Record<string,[number,number,number,number]> = {
 mxc:[87,77,20,20],obr:[135,77,20,20],her:[111,77,20,20],
 nav:[159,77,20,20],moc:[183,77,20,20],gsv:[208,77,20,20],
 cul:[232,77,20,20],maz:[254,78,20,20],jal:[274,99,25,20],
 nay:[326.9,77,20,20]
};
export async function GET(req:Request){
 const abbr=new URL(req.url).searchParams.get("abbr")??"gsv";
 const css=icons[abbr];
 if(!css)return NextResponse.json({error:"unknown"},{status:400});
 try {
  const sharp=(await import("sharp")).default;
  const image=await fetch("https://www.lmp.mx/assets/img/icons/LaMP_Iconos_wbc_10.webp",{cache:"no-store",signal:AbortSignal.timeout(16000)}).then(x=>x.arrayBuffer());
  const buf=Buffer.from(image);
  const meta=await sharp(buf).metadata();
  if(!meta.width||!meta.height)throw Error("no metadata");
  const scale=meta.width/392;
  const [x,y,w,h]=css;
  const out=await sharp(buf).extract({left:Math.round(x*scale),top:Math.round(y*scale),width:Math.round(w*scale),height:Math.round(h*scale)}).png().toBuffer();
  return NextResponse.json({abbr,width:meta.width,height:meta.height,scale,crop:{x,y,w,h},bytes:out.length,base64:out.toString("base64")},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return NextResponse.json({abbr,error:String(e)}, {status:500});}
}
