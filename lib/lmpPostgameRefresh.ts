/**
 * LMP postgame videos can be published after the last out. Keep an already
 * opened FINAL game page updating for 24h after the final recorded play,
 * then stop polling. Never start this behavior for MLB/LMB.
 *
 * The public LMP feed does not always expose a trustworthy game-end
 * timestamp. In that case use a BOUNDED 6h-after-scheduled-start proxy
 * (30h total after first pitch), not an unbounded 24h from page load.
 */
export const LMP_POSTGAME_REFRESH_MS = 5 * 60 * 1000;
const POSTGAME_WINDOW_MS = 24 * 60 * 60 * 1000;
const FALLBACK_GAME_LENGTH_MS = 6 * 60 * 60 * 1000;
const MAX_VALID_GAME_LENGTH_MS = 18 * 60 * 60 * 1000;

export function getLmpPostgameRefreshUntil(
  context: {
    league: string;
    isFinal: boolean;
    startTime?: string;
    lastPlayEndedAt?: string;
  },
  now: number = Date.now(),
): number | undefined {
  if (context.league !== "LMP" || !context.isFinal ||
      typeof context.startTime !== "string" || !context.startTime ||
      !Number.isFinite(now)) return undefined;

  const start = Date.parse(context.startTime);
  if (!Number.isFinite(start) || start > now) return undefined;

  const lastPlayEnd = context.lastPlayEndedAt
    ? Date.parse(context.lastPlayEndedAt)
    : NaN;
  const validRecordedEnd = Number.isFinite(lastPlayEnd) &&
    lastPlayEnd >= start &&
    lastPlayEnd <= start + MAX_VALID_GAME_LENGTH_MS &&
    lastPlayEnd <= now;

  // A bounded fallback covers late uploads even without the feed's last
  // play timestamp. The UI must not promise an exact end time in this case.
  const end = validRecordedEnd
    ? lastPlayEnd
    : start + FALLBACK_GAME_LENGTH_MS;
  const until = end + POSTGAME_WINDOW_MS;
  return now < until ? until : undefined;
}
