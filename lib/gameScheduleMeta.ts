/**
 * Datos complementarios de calendario para las tarjetas de MLB, LMB y LMP.
 * No inferimos motivos ni fechas que la fuente no entregue.
 */
type ScheduleSource = {
  status?: { reason?: unknown; startTimeTBD?: unknown };
  reason?: unknown;
  statusReason?: unknown;
  rescheduleGameDate?: unknown;
  rescheduleDate?: unknown;
  rescheduledGameDate?: unknown;
  startTimeTBD?: unknown;
  timeTBD?: unknown;
};

function firstText(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function dateOnly(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const candidate = value.trim();
    const match = /^(\d{4}-\d{2}-\d{2})(?:$|T)/.exec(candidate);
    if (!match) continue;
    const date = new Date(`${match[1]}T12:00:00Z`);
    if (Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === match[1]) {
      return match[1];
    }
  }
  return undefined;
}

export function getScheduleCardMeta(source: ScheduleSource) {
  const tbd = source.status?.startTimeTBD ??
    source.startTimeTBD ??
    source.timeTBD;

  return {
    statusReason: firstText(
      source.status?.reason,
      source.statusReason,
      source.reason
    ),
    rescheduleDate: dateOnly(
      source.rescheduleGameDate,
      source.rescheduleDate,
      source.rescheduledGameDate
    ),
    startTimeTBD: typeof tbd === "boolean" ? tbd : undefined,
  };
}

type SecondGame = {
  status: string;
  doubleHeader?: string;
  gameNumber?: number;
  startTime: string;
  startTimeTBD?: boolean;
};

/**
 * Segundo juego: mantener «HORA POR CONFIRMAR» cuando no hay
 * confirmación explícita en doble cartelera tradicional.
 * Para split/inferida, usar la hora válida salvo TBD explícito.
 */
export function isSecondGameTimeUnconfirmed(game: SecondGame): boolean {
  if (
    game.status !== "Preview" ||
    game.gameNumber !== 2 ||
    !["Y", "S", "INFERRED"].includes(game.doubleHeader ?? "")
  ) return false;

  if (!Number.isFinite(Date.parse(game.startTime))) return true;
  if (game.startTimeTBD === true) return true;
  return game.doubleHeader === "Y" && game.startTimeTBD !== false;
}
