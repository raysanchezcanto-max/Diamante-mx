// Conexiones editoriales verificadas: no generan movimientos ni altas de roster.
type Movement = {url:string;date:string;title:string;description:string;direction?:"in"|"out";otherClub?:string};
const BULLETIN = "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-16-de-octubre-de-2026";
const NEWS = "https://lmb.com.mx/noticias/gustavo-nunez-llegara-en-2027-la-frontera-con-los-campeones-toros";
function canonical(value:string):string|null {
  try { const u=new URL(value);
    return u.protocol==="https:" && u.hostname==="lmb.com.mx" && !u.port && !u.username && !u.password && !u.search && !u.hash && /^\/noticias\/[a-z0-9-]+\/?$/.test(u.pathname)
      ? u.origin+u.pathname.replace(/\/$/,"") : null;
  } catch { return null; }
}
function normalize(s:string) {return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
export function verifiedTransferNewsForMovement(club:string,movement:Movement):string|null {
  if (canonical(movement.url)!==BULLETIN || movement.date!=="2026-10-16") return null;
  const direction=club==="toros"?"in":club==="sultanes"?"out":null;
  const counterpart=club==="toros"?"sultanes de monterrey":"toros de tijuana";
  if (!direction || movement.direction!==direction || normalize(movement.otherClub??"")!==counterpart) return null;
  return /\bgustavo adolfo nunez castillo\b/.test(normalize(movement.title+" "+movement.description)) ? NEWS : null;
}
export function verifiedTransferNewsForClub(club:string,articleUrl:string,movements:readonly Movement[]):boolean {
  return canonical(articleUrl)===NEWS && movements.some(item=>verifiedTransferNewsForMovement(club,item)===NEWS);
}
