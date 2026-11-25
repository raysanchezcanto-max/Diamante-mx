import type { OfficialMovementPreview } from "@/lib/officialMovementPreview";

type Props = {
  league: "LMB" | "LMP";
  clubName: string;
  items: readonly OfficialMovementPreview[];
  movementsHref: string;
  officialSourceHref: string;
};
const formatDay = (date: string) => new Intl.DateTimeFormat("es-MX", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(date + "T12:00:00Z"));

/**
 * Complemento del Resumen. El registro y el periodismo permanecen separados:
 * aquí NO se declara que una noticia individual verifique una contratación.
 */
export default function OfficialMovementPreviewSection({
  league, clubName, items, movementsHref, officialSourceHref,
}: Props) {
  if (!items.length) return null;
  return <section className="clubEditorialSection" aria-label={"Movimientos registrados de " + clubName}>
    <div className="clubSectionTitle">
      <div>
        <span className="clubKicker">MOVIMIENTOS · REGISTRO {league}</span>
        <h2>Movimientos recientes documentados</h2>
      </div>
      <a href={movementsHref}>Ver historial ↗</a>
    </div>
    <p className="clubSmallNote">{league === "LMB"
      ? "Boletines de listas de reserva y nombramientos del cuerpo técnico confirmados por LMB, independientes de las noticias. Las cesiones de derechos no garantizan participación en la plantilla activa."
      : "Extractos del registro de movimientos de LMP. Activaciones y desactivaciones no equivalen necesariamente a contrataciones o bajas definitivas. Estas entradas no acreditan por sí solas los titulares periodísticos."}</p>
    <div className="clubNewsGrid">
      {items.map((item, index) => <a
        className="clubNewsCard"
        key={item.date + item.title + index}
        href={item.sourceUrl ?? movementsHref}
        {...(item.sourceUrl ? {target: "_blank", rel: "noopener noreferrer"} : {})}>
        <span>{item.kind === "official-appointment" ? "NOMBRAMIENTO OFICIAL · LMB" : "REGISTRO " + league} · {formatDay(item.date)}</span>
        <strong>{item.title}</strong>
        {item.excerpt && <small>{item.excerpt}</small>}
        <small>{item.kind === "official-appointment" ? "Consultar anuncio oficial ↗" : item.sourceUrl ? "Consultar boletín oficial ↗" : "Ver movimiento en el historial ↗"}</small>
      </a>)}
    </div>
    <a className="clubDirectorySource" href={officialSourceHref} target="_blank" rel="noopener noreferrer">
      Consultar fuente oficial de movimientos {league} ↗
    </a>
  </section>;
}
