import { verifiedPersonnelEventsForClub, staffEventLabel } from "@/lib/verifiedPersonnelEvents";
import type { OfficialMovementPreview } from "@/lib/officialMovementPreview";

type Props = {
  league: "LMB" | "LMP";
  clubSlug: string;
  recentPreview: readonly OfficialMovementPreview[];
};
const dateLabel = (date: string): string => new Intl.DateTimeFormat("es-MX", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(date + "T12:00:00Z"));

/**
 * Historial editorial complementario. Los anuncios que ya aparecen en las
 * tarjetas de movimientos recientes NO se duplican en esta sección.
 * Una publicación pasada no garantiza quién ocupa el cargo hoy.
 */
export default function OfficialStaffHistorySection({league,clubSlug,recentPreview}:Props){
  const notices=verifiedPersonnelEventsForClub(league,clubSlug)
    .filter(event=>!recentPreview.some(item=>
      item.kind==="official-appointment" && item.sourceUrl===event.url &&
      (item.title.includes(event.person) || item.excerpt.includes(event.person))
    ));
  // Un comunicado puede anunciar varios coaches: agrupar por fuente y fecha
  // para evitar tarjetas idénticas y conservar visibles todos sus nombres.
  const grouped=new Map<string,typeof notices>();
  for(const event of notices){
    const key=event.url+"|"+event.date;
    const group=grouped.get(key)??[];
    group.push(event);
    grouped.set(key,group);
  }
  const visible=[...grouped.values()].slice(0,3);
  if(!visible.length)return null;
  return <section className="clubEditorialSection" aria-label={"Comunicados de cuerpo técnico "+league}>
    <div className="clubSectionTitle">
      <div><span className="clubKicker">CUERPO TÉCNICO · {league}</span>
        <h2>Anuncios oficiales documentados</h2></div>
    </div>
    <p className="clubSmallNote">Historial de anuncios institucionales con fecha y fuente. No equivale a la plantilla vigente ni confirma por sí solo quién ocupa actualmente cada cargo.</p>
    <div className="clubNewsGrid">
      {visible.map(group=>{
        const event=group[0];
        return <a className="clubNewsCard"
          href={event.url} target="_blank" rel="noopener noreferrer"
          key={event.clubSlug+"|"+event.date+"|"+event.url}>
          <span>{(group.every(member=>member.kind===event.kind)?staffEventLabel(event.kind):"Movimientos del cuerpo técnico").toLocaleUpperCase("es")} · {dateLabel(event.date)}</span>
          <strong>{group.length===1
            ? event.person+" · "+event.role
            : group.length+" integrantes del cuerpo técnico documentados"}</strong>
          {group.length===1?<small>{event.description}</small>:group.map(member=>
            <small key={member.person+"|"+member.role}>{member.person} · {member.role}{member.kind==="role-change"?` · ${member.description}`:""}</small>)}
          <small>Consultar comunicado oficial {league} ↗</small>
        </a>;
      })}
    </div>
  </section>;
}
