import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const GAME = 846674;

async function inspect(label: string, url: string) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(7500),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return { label, status: response.status };
    const data: any = await response.json();
    const game = data?.games_info?.[0];
    if (game) {
      return {
        label, status: response.status,
        keys: Object.keys(game).slice(0, 90),
        id: game.gameId,
        names: [game.awayTeam?.name, game.localTeam?.name],
        scores: [game.awayTeam?.runsScored, game.localTeam?.runsScored],
        inningCount: game.lineScore?.length,
        featureKeys: Object.keys(game).filter((k: string) =>
          /player|pitch|bat|stat|score|box|win|lose|save|detail|offense|defense/i.test(k)),
        samples: Object.fromEntries(
          Object.entries(game).filter(([k]) =>
            /box|pitch|bat|stat|winner|loser|save/i.test(k)).slice(0, 8)
            .map(([k, v]) => [k, Array.isArray(v) ? { type: "array", length: v.length, firstKeys: Object.keys(v[0] ?? {}) } : typeof v === "object" ? { type: "object", keys: Object.keys(v ?? {}).slice(0, 30) } : v])
        ),
      };
    }
    const feed = data?.liveData;
    if (feed) {
      const sides = ["away", "home"] as const;
      return {
        label, status: response.status, gamePk: data.gamePk,
        gameTeams: sides.map((side) => ({
          side,
          name: data.gameData?.teams?.[side]?.name,
          players: Object.keys(feed.boxscore?.teams?.[side]?.players ?? {}).length,
          batters: feed.boxscore?.teams?.[side]?.batters?.length ?? 0,
          pitchers: feed.boxscore?.teams?.[side]?.pitchers?.length ?? 0,
          sampleBatter: feed.boxscore?.teams?.[side]?.batters?.slice(0, 2).map((id: number) => {
            const player = feed.boxscore.teams[side].players[`ID${id}`];
            return { id, name: player?.person?.fullName, stats: player?.stats?.batting };
          }),
          samplePitcher: feed.boxscore?.teams?.[side]?.pitchers?.slice(0, 2).map((id: number) => {
            const player = feed.boxscore.teams[side].players[`ID${id}`];
            return { id, name: player?.person?.fullName, stats: player?.stats?.pitching };
          }),
        })),
        decisions: feed.decisions,
        linescore: { innings: feed.linescore?.innings?.length, away: feed.linescore?.teams?.away, home: feed.linescore?.teams?.home },
      };
    }
    if(data?.teams && !feed) {
      return {label,status:response.status,keys:Object.keys(data),teamKeys:Object.keys(data.teams)};
    }
    return { label, status: response.status, keys: Object.keys(data).slice(0, 30) };
  } catch (e) {
    return { label, error: e instanceof Error ? e.name : "unknown" };
  }
}
export async function GET() {
  const checks = await Promise.all([
    inspect("LMB detail", `https://lmb.com.mx/juegos/api/detail?permalink=${GAME}`),
    inspect("MLB stats game feed", `https://statsapi.mlb.com/api/v1.1/game/${GAME}/feed/live`),
    inspect("MLB stats boxscore", `https://statsapi.mlb.com/api/v1/game/${GAME}/boxscore`),
    inspect("LMB juego boxscore endpoint", `https://lmb.com.mx/juegos/api/boxscore?permalink=${GAME}`),
  ]);
  return NextResponse.json({ kind: "temporary_lmb_source_probe", game: GAME, checks }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
