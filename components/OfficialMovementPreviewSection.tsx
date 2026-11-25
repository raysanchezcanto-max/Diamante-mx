import type { OfficialMovementPreview } from "@/lib/officialMovementPreview";
import { staffEventLabel } from "@/lib/verifiedPersonnelEvents";

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
        <span className="clubKicker">MOVIMIENTOS · FUENTES OFICIALES {league}</span>
        <h2>Movimientos recientes documentados</h2>
      </div>
      <a href={movementsHref}>Ver historial ↗</a>
    </div>
    <p className="clubSmallNote">{league === "LMB"
      ? "Boletines de listas de reserva y anuncios institucionales verificados del cuerpo técnico. Las cesiones de derechos no garantizan cambios de plantilla activa."
      : "Extractos del registro de altas y bajas LMP, junto con anuncios institucionales verificados del cuerpo técnico. No son equivalentes a contrataciones o liberaciones definitivas y no acreditan por sí solos los titulares periodísticos."}</p>
    <div className="clubNewsGrid">
      {items.map((item, index) => <a
        className="clubNewsCard"
        key={item.date + item.title + index}
        href={item.sourceUrl ?? movementsHref}
        {...(item.sourceUrl ? {target: "_blank", rel: "noopener noreferrer"} : {})}>
        <span>{item.kind === "official-appointment" ? staffEventLabel(item.staffKind ?? "appointment").toLocaleUpperCase("es") + " · " + league : "REGISTRO " + league} · {formatDay(item.date)}</span>
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
