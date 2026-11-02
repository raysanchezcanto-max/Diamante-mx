import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ProbeResult = {
  label: string;
  httpStatus?: number;
  games?: number;
  sample?: { id: number; away: string; home: string; awayScore?: number; homeScore?: number; state?: string }[];
  apiStatus?: string;
  error?: string;
};

async function probe(label: string, url: string): Promise<ProbeResult> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { label, httpStatus: res.status, error: "upstream_http_error" };
    const data: any = await res.json();

    if (Array.isArray(data.dates)) {
      const games = data.dates.flatMap((date: any) => date.games ?? []);
      return {
        label,
        httpStatus: res.status,
        games: games.length,
        sample: games.slice(0, 4).map((g: any) => ({
          id: g.gamePk,
          away: g.teams?.away?.team?.name ?? "?",
          home: g.teams?.home?.team?.name ?? "?",
          awayScore: g.teams?.away?.score,
          homeScore: g.teams?.home?.score,
          state: g.status?.abstractGameState ?? g.status?.detailedState,
        })),
      };
    }
    if (data.gamePk && data.gameData) {
      return {
        label,
        httpStatus: res.status,
        games: 1,
        sample: [{
          id: data.gamePk,
          away: data.gameData.teams?.away?.name ?? "?",
          home: data.gameData.teams?.home?.name ?? "?",
          state: data.gameData.status?.abstractGameState ?? data.gameData.status?.detailedState,
        }],
        apiStatus: typeof data.liveData?.plays?.allPlays?.length === "number" ? "has_play_by_play" : "no_play_by_play",
      };
    }
    return { label, httpStatus: res.status, error: "unrecognized_payload" };
  } catch (e) {
    return { label, error: e instanceof Error ? e.name : "fetch_error" };
  }
}

export async function GET() {
  const base = "https://statsapi.mlb.com/api/v1/";
  const tasks = [
    probe("Caribbean 2026 / sport 17", base + "schedule?sportId=17&leagueId=162&startDate=2026-02-01&endDate=2026-02-07"),
    probe("Caribbean 2026 / sport 51", base + "schedule?sportId=51&leagueId=162&startDate=2026-02-01&endDate=2026-02-07"),
    probe("Caribbean 2027 / sport 17", base + "schedule?sportId=17&leagueId=162&startDate=2027-02-01&endDate=2027-02-07"),
    probe("Official MLB Gameday 2026 / game 837060", base + "game/837060/feed/live"),
  ];
  const checks = await Promise.all(tasks);
  return NextResponse.json({
    kind: "temporary_caribe_source_probe",
    checkedAt: new Date().toISOString(),
    checks,
  }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
