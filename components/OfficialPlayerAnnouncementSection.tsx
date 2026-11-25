import { verifiedLmbPlayerAnnouncements } from "@/lib/verifiedLmbPlayerAnnouncements";
import type { OfficialMovementPreview } from "@/lib/officialMovementPreview";
type Props={clubSlug:string;recentPreview:readonly OfficialMovementPreview[];movementsHref:string};
const displayDate=(date:string)=>new Intl.DateTimeFormat("es-MX",{
  day:"numeric",month:"short",year:"numeric",timeZone:"UTC",
}).format(new Date(date+"T12:00:00Z"));

/** Solo comunicados revisados; nunca se infiere una transacción o roster activo. */
export default function OfficialPlayerAnnouncementSection({clubSlug,recentPreview,movementsHref}:Props){
  const notices=verifiedLmbPlayerAnnouncements("https://lmb.com.mx/equipos/"+clubSlug)
    .filter(item=>!recentPreview.some(p=>
      p.kind==="official-player-announcement"&&p.sourceUrl===item.url
    )).slice(0,3);
  if(!notices.length)return null;
  return <section className="clubEditorialSection" aria-label="Anuncios documentados de regresos de jugadores LMB">
    <div className="clubSectionTitle">
      <div><span className="clubKicker">JUGADORES · COMUNICADOS DEL CLUB</span>
        <h2>Regresos anunciados</h2></div>
      <a href={movementsHref}>Ver historial ↗</a>
    </div>
    <p className="clubSmallNote">Anuncios históricos confirmados por el club. No equivalen por sí solos a un alta en lista de reserva, participación o disponibilidad en el roster activo.</p>
    <div className="clubNewsGrid">
      {notices.map(item=><div className="clubNewsCard" key={item.clubSlug+"|"+item.date+"|"+item.url}>
        <span>REGRESO ANUNCIADO · {displayDate(item.date)}</span>
        <strong>{item.player}</strong>
        <small>{item.description}</small>
        <a href={item.url} target="_blank" rel="noopener noreferrer">Leer anuncio oficial LMB ↗</a>
        <a href={movementsHref}>Ver detalle en Movimientos ↗</a>
      </div>)}
    </div>
  </section>;
}
