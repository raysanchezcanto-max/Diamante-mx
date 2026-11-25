/**
 * Comunicados de jugadores corroborados por el club/LMB que aún NO
 * acreditan un alta en listas de reserva ni disponibilidad en roster.
 * La fuente y la fecha deben verificarse editorialmente caso por caso.
 */
export type VerifiedLmbPlayerAnnouncement={
  clubSlug:string;
  date:string;
  player:string;
  kind:"return-announced";
  url:string;
  description:string;
};
const APPROVED:readonly VerifiedLmbPlayerAnnouncement[]=[
  {
    clubSlug:"guerreros",
    date:"2026-11-07",
    player:"Cristian Alvarado",
    kind:"return-announced",
    url:"https://lmb.com.mx/noticias/cristian-alvarado-esta-de-vuelta-con-los-guerreros-de-oaxaca",
    description:"Guerreros de Oaxaca anunció el regreso del lanzador Cristian Alvarado el 7 de noviembre de 2026. El comunicado confirma el anuncio del club, no por sí solo un alta en su lista de reserva ni su presencia en el roster activo.",
  },
];
export function verifiedLmbPlayerAnnouncements(profileUrl:string):VerifiedLmbPlayerAnnouncement[]{
  const m=/^https:\/\/lmb\.com\.mx\/equipos\/([a-z0-9-]+)$/.exec(profileUrl);
  if(!m)return [];
  return APPROVED.filter(e=>e.clubSlug===m[1]).map(e=>({...e}));
}
function canonicalOfficialNewsUrl(value:string):string|null{
  try{
    const u=new URL(value);
    if(u.protocol!=="https:"||u.hostname!=="lmb.com.mx"||u.username||
       u.password||u.port||u.search||u.hash||
       !/^\/noticias\/[a-z0-9-]+\/?$/.test(u.pathname))return null;
    return u.origin+u.pathname.replace(/\/+$/,"");
  }catch{return null;}
}
export function verifiedLmbPlayerNewsForClub(
  clubSlug:string,articleUrl:string,
):VerifiedLmbPlayerAnnouncement[]{
  const url=canonicalOfficialNewsUrl(articleUrl);
  if(!url||!/^[a-z0-9-]{2,50}$/.test(clubSlug))return [];
  return APPROVED.filter(item=>item.clubSlug===clubSlug &&
    canonicalOfficialNewsUrl(item.url)===url).map(e=>({...e}));
}
