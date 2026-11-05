// Cambios de lanzador LMP obtenidos del play-by-play oficial.
// Primero se usan los eventos explícitos; la secuencia real de pitchers
// en turnos con lanzamientos sirve de respaldo cuando falta ese evento.
export type LmpPitchingChange = {
  id: string;
  side: "away" | "home";
  inning: number;
  half: "ALTA" | "BAJA";
  outName: string;
  inName: string;
  outId?: number;
  inId?: number;
};

type Pitcher = { id: number; name: string };
type Side = LmpPitchingChange["side"];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizedName(name: string): string {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]/g, "");
}

function readChangeDescription(value: unknown) {
  const description = text(value);
  const match = description.match(
    /^(?:Pitching Change|Pitching Substitution|Cambio de lanzador)\s*[:\-]\s*(.+?)\s+(?:replaces|reemplaza a|sustituye a)\s+(.+?)\.?$/i
  );
  if (!match) return null;
  const inName = match[1].trim().replace(/[.\s]+$/, "");
  const outName = match[2].trim().replace(/[.\s]+$/, "");
  return inName && outName ? { inName, outName } : null;
}

export function getLmpPitchingChanges(allPlays: unknown): LmpPitchingChange[] {
  if (!Array.isArray(allPlays)) return [];

  const changes: LmpPitchingChange[] = [];
  const seenIncoming = new Set<string>();
  const previous: Partial<Record<Side, Pitcher>> = {};

  // Resolver los IDs solamente a partir de pitchers que efectivamente
  // lanzaron para ese equipo en el mismo juego, no por coincidencia global
  // de nombres ni por probables.
  const idsByTeam: Record<Side, Map<string, number>> = {
    away: new Map(),
    home: new Map(),
  };
  for (const rawPlay of allPlays) {
    const item = rawPlay as any;
    const half = text(item?.about?.halfInning).toLowerCase();
    const side: Side | null =
      half === "top" ? "home" : half === "bottom" ? "away" : null;
    const pitcher = item?.matchup?.pitcher;
    const id = pitcher?.id;
    const name = text(pitcher?.fullName);
    const pitched = Array.isArray(item?.playEvents) &&
      item.playEvents.some((event: any) => event?.isPitch === true);
    if (side && pitched && Number.isSafeInteger(id) && id > 0 && name) {
      idsByTeam[side].set(normalizedName(name), id);
    }
  }

  const add = (
    side: Side, inning: number, half: "ALTA" | "BAJA",
    outName: string, inName: string
  ) => {
    if (!Number.isInteger(inning) || inning < 1 ||
      !outName || !inName || normalizedName(outName) === normalizedName(inName)) return;

    // Un pitcher sustituido no puede regresar a lanzar en el mismo juego.
    // Evita duplicados entre acciones explícitas y respaldo por secuencia.
    const incomingKey = `${side}:${normalizedName(inName)}`;
    if (seenIncoming.has(incomingKey)) return;
    seenIncoming.add(incomingKey);

    changes.push({
      id: `${side}-${inning}-${normalizedName(inName)}`,
      side, inning, half, outName, inName,
      outId: idsByTeam[side].get(normalizedName(outName)),
      inId: idsByTeam[side].get(normalizedName(inName)),
    });
  };

  for (const play of allPlays) {
    const item = play as any;
    const inning = Number(item?.about?.inning);
    const rawHalf = text(item?.about?.halfInning).toLowerCase();
    // En la ALTA lanza el local; en la BAJA lanza el visitante.
    const side: Side | null =
      rawHalf === "top" ? "home" :
      rawHalf === "bottom" ? "away" : null;
    if (!side || !Number.isInteger(inning) || inning < 1) continue;
    const half = rawHalf === "top" ? "ALTA" : "BAJA";

    for (const event of Array.isArray(item?.playEvents) ? item.playEvents : []) {
      const desc = event?.details?.description ?? event?.result?.description;
      const eventType = text(event?.details?.eventType ?? event?.details?.event)
        .toLowerCase();
      if (!/pitching[_\s-]*(?:change|substitution)/.test(eventType) &&
          !/^(?:pitching change|pitching substitution|cambio de lanzador)/i.test(text(desc))) {
        continue;
      }
      const parsed = readChangeDescription(desc);
      if (parsed) add(side, inning, half, parsed.outName, parsed.inName);
    }

    // Algunos feeds incluyen la sustitución en result y no en playEvents.
    const resultType = text(item?.result?.eventType ?? item?.result?.event);
    if (/pitching (?:change|substitution)/i.test(resultType) ||
        /^pitching (?:change|substitution)/i.test(text(item?.result?.description))) {
      const parsed = readChangeDescription(item?.result?.description);
      if (parsed) add(side, inning, half, parsed.outName, parsed.inName);
    }

    // Respaldo: deducir el relevo solo a partir de turnos con un
    // lanzamiento registrado y dos pitchers distintos del mismo equipo.
    const hasPitch = Array.isArray(item?.playEvents) &&
      item.playEvents.some((event: any) => event?.isPitch === true);
    const pitcherId = item?.matchup?.pitcher?.id;
    const pitcherName = text(item?.matchup?.pitcher?.fullName);
    if (hasPitch && typeof pitcherId === "number" && pitcherName) {
      const prior = previous[side];
      if (prior && prior.id !== pitcherId) {
        add(side, inning, half, prior.name, pitcherName);
      }
      previous[side] = { id: pitcherId, name: pitcherName };
    }
  }

  return changes;
}
