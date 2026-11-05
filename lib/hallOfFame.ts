// Catálogo público oficial de Salón de la Fama del Beisbol Mexicano.
// El directorio alfabético indica el año de entronización; el directorio por
// actividad permite clasificar sin adivinar las profesiones de los inmortales.
export const HALL_OFFICIAL_DIRECTORY =
  "https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico";
export const HALL_OFFICIAL_ACTIVITY =
  "https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-actividad";

export type HallInductee = {
  name: string;
  year: number;
  activity: string;
  algodoneros: boolean;
};
export type HallResult = {
  inductees: HallInductee[];
  sourceStatus: "connected" | "fallback";
  activitiesVerified: boolean;
};
const cacheSeconds = 86400;
const aliasCorrections: Record<string,string> = {
  "martindihigo":"Martín Dihigo",
  "guillermogaribay":"Guillermo Garibay",
  "antoniopollorena":"Antonio Pollorena",
  "jesusdiaz":"Jesús Díaz",
  "hectorespino":"Héctor Espino",
  "fernandovalenzuela":"Fernando Valenzuela",
  "viniciocastilla":"Vinicio Castilla",
  "robertoavila":"Roberto Ávila",
};
export const ALGODONEROS_HALL_KEYS = ["martindihigo","guillermogaribay","antoniopollorena","jesusdiaz"];
export const ALGODONEROS_HALL_DETAILS: Record<string,{relation:string;highlight:string}> = {
  martindihigo: {relation:"Jugador-mánager · campeón 1942",highlight:"Condujo a Unión Laguna al primer campeonato de la LMB en 1942."},
  guillermogaribay: {relation:"Mánager · campeón 1950",highlight:"Dirigió a Algodoneros a su segunda corona de LMB, en 1950."},
  antoniopollorena: {relation:"Lanzador · Unión Laguna",highlight:"Destacado lanzador de Algodoneros: registró 25 victorias y 183 ponches en 1974."},
  jesusdiaz: {relation:"Jardinero · Novato del Año 1942",highlight:"Jesús «Chanquilón» Díaz fue Novato del Año de LMB con Unión Laguna en 1942."},
};
export const HALL_FEATURED: Record<string, {title:string;description:string}> = {
  martindihigo: {title:"El Maestro",description:"Campeón de Unión Laguna como jugador-mánager en 1942; uno de los grandes nombres de la historia del beisbol."},
  hectorespino: {title:"El Supermán de Chihuahua",description:"Figura histórica del bateo mexicano; su entronización oficial fue en 1988."},
  fernandovalenzuela: {title:"El Toro",description:"Ícono de los Dodgers y del béisbol mexicano. Su ingreso al Salón fue en 2014."},
};
export function hallKey(value:string):string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
}
const entityMap:Record<string,string>={
 amp:"&",quot:'"',apos:"'",nbsp:" ",lt:"<",gt:">",
 aacute:"á",eacute:"é",iacute:"í",oacute:"ó",uacute:"ú",ntilde:"ñ",uuml:"ü",
 Aacute:"Á",Eacute:"É",Iacute:"Í",Oacute:"Ó",Uacute:"Ú",Ntilde:"Ñ",Uuml:"Ü",
 ldquo:"“",rdquo:"”",lsquo:"‘",rsquo:"’",laquo:"«",raquo:"»",ndash:"–"
};
function decodeEntities(str:string):string {
  return str.replace(/&(#x[0-9a-f]+|#\d+|[a-zA-Z]+);/gi,(full,entity:string)=>{
    if(entity.charAt(0)==="#"){
      const code=entity.charAt(1).toLowerCase()==="x"?parseInt(entity.slice(2),16):Number(entity.slice(1));
      return Number.isInteger(code)&&code>=32&&code<=0x10ffff?String.fromCodePoint(code):full;
    }
    return entityMap[entity]??entityMap[entity.toLowerCase()]??full;
  });
}
function plain(html:string):string {
  return decodeEntities(html.replace(/<[^>]*>/g," ").replace(/[\u00a0]+/g," ")).replace(/\s+/g," ").trim();
}
export function parseHallAlphabetical(html:string):HallInductee[]{
  // Limitarse al catálogo: el Wix incluye otros años en encabezados y scripts.
  const a=html.indexOf("Abel Francisco Cano 1988");
  const b=html.indexOf("Yovani Gallardo 2024",a);
  if(a<0||b<=a)return [];
  const section=html.slice(Math.max(0,a-300),b+150);
  const found=new Map<string,HallInductee>();
  for(const match of section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)){
    const label=plain(match[1]);
    const entry=label.match(/^(.{3,95}?)\s+(19\d{2}|20\d{2})$/);
    if(!entry)continue;
    const year=Number(entry[2]);
    if(year<1939||year>2035)continue;
    const name=entry[1].trim();
    const key=hallKey(name);
    if(!key||found.has(key))continue;
    found.set(key,{name:aliasCorrections[key]??name,year,activity:"Sin clasificar",algodoneros:ALGODONEROS_HALL_KEYS.includes(key)});
  }
  return [...found.values()].sort((a,b)=>a.name.localeCompare(b.name,"es"));
}
const headings=[
  ["LANZADORES","Lanzadores"],
  ["CATCHERS","Receptores"],
  ["PRIMERAS BASES","Primera base"],
  ["SEGUNDAS BASES","Segunda base"],
  ["TERCERAS BASES","Tercera base"],
  ["SHORT STOPS","Parador en corto"],
  ["JARDINEROS","Jardineros"],
  ["MANAGERS","Mánagers"],
  ["AMPAYERS","Ampáyers"],
  ["DIRECTIVOS","Directivos"],
  ["CRONISTAS","Cronistas"],
] as const;
export function parseHallActivity(html:string):Map<string,string>{
  // Wix SSR: los encabezados y las listas numeradas aparecen en texto visible.
  const visible=decodeEntities(html
    .replace(/<\/(?:p|li|h[1-6]|div)>/gi,"\n")
    .replace(/<[^>]*>/g," ")
    .replace(/&nbsp;/gi," ")
    .replace(/[ \t]+/g," "));
  const start=visible.indexOf("LANZADORES (68)");
  const end=visible.indexOf("© 2019",start);
  if(start<0)return new Map();
  const section=visible.slice(start,end>start?end:start+100000);
  const map=new Map<string,string>();
  for(let i=0;i<headings.length;i++){
    const [heading,label]=headings[i];
    const from=section.search(new RegExp(heading+"\\s*\\(\\d+\\)","i"));
    if(from<0)continue;
    let to=section.length;
    for(let j=i+1;j<headings.length;j++){
      const idx=section.search(new RegExp(headings[j][0]+"\\s*\\(\\d+\\)","i"));
      if(idx>from){to=idx;break}
    }
    const block=section.slice(from,to);
    for(const line of block.split(/\n+/)){
      const clean=line.trim();
      const m=clean.match(/^\d{1,3}\.?\s+(.{3,95})$/);
      if(!m)continue;
      const key=hallKey(m[1].replace(/\u200b/g,"").trim());
      if(key&&!map.has(key))map.set(key,label);
    }
  }
  return map;
}
const fallback:HallInductee[]=[
  ["Martín Dihigo",1964,"Lanzadores"],["Guillermo Garibay",1977,"Mánagers"],
  ["Antonio Pollorena",1991,"Lanzadores"],["Jesús Díaz",1979,"Jardineros"],
  ["Héctor Espino",1988,"Primera base"],["Fernando Valenzuela",2014,"Lanzadores"],
  ["Roberto Ávila",1971,"Segunda base"],["Vinicio Castilla",2020,"Tercera base"],
  ["Lázaro Salazar",1964,"Mánagers"],["Alejandro Aguilar Reyes",1971,"Cronistas"],
  ["Alfredo Harp Helú",2023,"Directivos"],["Antonio Delfín “Lañiza”",1939,"Lanzadores"],
  ["Lucas Juárez",1939,"Lanzadores"],["Teodoro Higuera",2011,"Lanzadores"],
  ["Jorge Orta",1996,"Segunda base"],["Andrés Mora",2003,"Jardineros"],
  ["Matías Carrillo",2020,"Jardineros"],["Aurelio López",1993,"Lanzadores"],
].map(([name,year,activity])=>({name:String(name),year:Number(year),activity:String(activity),algodoneros:ALGODONEROS_HALL_KEYS.includes(hallKey(String(name)))}))
.sort((a,b)=>a.name.localeCompare(b.name,"es"));

async function fetchPage(url:string):Promise<string|null>{
  try{
    const res=await fetch(url,{next:{revalidate:cacheSeconds},headers:{Accept:"text/html","User-Agent":"Mozilla/5.0 (compatible; DiamanteMX/1.0)"},signal:AbortSignal.timeout(11000)});
    if(!res.ok||!(res.headers.get("content-type")??"").includes("text/html"))return null;
    const html=await res.text();
    return html.length>10000?html:null;
  }catch{return null}
}
export async function getHallOfFame():Promise<HallResult>{
  const [directory,activities]=await Promise.all([fetchPage(HALL_OFFICIAL_DIRECTORY),fetchPage(HALL_OFFICIAL_ACTIVITY)]);
  const people=directory?parseHallAlphabetical(directory):[];
  if(people.length<180||people.length>280)return{inductees:fallback,sourceStatus:"fallback",activitiesVerified:false};
  const categories=activities?parseHallActivity(activities):new Map<string,string>();
  return {inductees:people.map(p=>({
    ...p,activity:categories.get(hallKey(p.name))??fallback.find(f=>hallKey(f.name)===hallKey(p.name))?.activity??"Sin clasificar"
  })),sourceStatus:"connected",activitiesVerified:categories.size>100};
}
