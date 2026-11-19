/**
 * Preserve an LMP game scheduled yesterday only while a genuine overnight
 * continuation is plausible. Some StatsAPI records remain "Live" long after
 * the final out, so yesterday's stale card must not occupy "Juegos de hoy".
 *
 * This deliberately does NOT infer "Final": that status must come from the
 * official feed. A late or suspended game can still be opened from its
 * historical schedule once the overnight window has elapsed.
 */
export const LMP_OVERNIGHT_LIVE_WINDOW_MS = 12 * 60 * 60 * 1000;

export function isLmpOvernightLiveGame(
  game: {
    scheduledDay: string;
    yesterday: string;
    status?: string;
    startTime?: string;
  },
  now: number = Date.now(),
): boolean {
  if (game.scheduledDay !== game.yesterday || game.status !== "Live" ||
      typeof game.startTime !== "string" || !Number.isFinite(now)) {
    return false;
  }

  const scheduledStart = Date.parse(game.startTime);
  if (!Number.isFinite(scheduledStart) || scheduledStart > now) {
    return false;
  }

  return now - scheduledStart <= LMP_OVERNIGHT_LIVE_WINDOW_MS;
}
