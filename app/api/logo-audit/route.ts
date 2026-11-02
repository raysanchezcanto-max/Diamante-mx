import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const pages = [
  ["conspiradores", "https://lmb.com.mx/equipos/conspiradores"],
  ["leones", "https://lmb.com.mx/equipos/leones"],
  ["liga", "https://lmb.com.mx/equipos"],
  ["lmp", "https://www.lmp.mx/"],
];

function clean(v: string) { return v.replace(/&amp;/g, "&").replace(/\\u0026/g, "&"); }

async function check(label: string, url: string) {
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    const html = await response.text();
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => {
      const attr=(key:string) => tag.match(new RegExp('(?:^|\\s)'+key+'="([^"]*)"','i'))?.[1]??"";
      return {alt:attr("alt"),src:clean(attr("src")).slice(0,360),srcSet:clean(attr("srcset")).slice(0,450),dataSrc:clean(attr("data-src")).slice(0,350)};
    });
    return {label,status:response.status,bytes:html.length,
      relevant:imgs.filter(x=>/conspir|leones|yucatan|logo|equipo|team/i.test(x.alt+" "+x.src)).slice(0,28),
      head:imgs.slice(0,6),
      nextImageCount:(html.match(/_next\/image/g)||[]).length,
    };
  } catch(e){return {label,error:e instanceof Error?e.message:"fetch error"};}
}
export async function GET(){
  return NextResponse.json({checks:await Promise.all(pages.map(([label,url])=>check(label,url)))},{headers:{"Cache-Control":"no-store"}});
}
